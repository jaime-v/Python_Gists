"""
routers/users.py

Defines the routes/endpoints in the API for users
"""

from fastapi import Depends, status, APIRouter, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import func, select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from datetime import timedelta
from typing import Annotated

from app.schemas import (
    UserCreate,
    UserUpdate,
    UserPublic,
    UserPrivate,
    Token,
    SnippetResponse,
)
from app.db import get_db
from app.auth import (
    create_access_token,
    hash_password,
    oauth2_scheme,
    verify_access_token,
    verify_password,
)
import app.models as models

from config import settings

router = APIRouter(prefix="/api/users", tags=["users"])


# Create user in database
@router.post("", response_model=UserPrivate, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.User).where(
            func.lower(models.User.username) == user.username.lower()
        )
    )
    existing_user = result.scalars().first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Username already exists",
        )
    result = await db.execute(
        select(models.User).where(func.lower(models.User.email) == user.email.lower()),
    )
    existing_email = result.scalars().first()
    if existing_email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="Email already registered"
        )
    new_user = models.User(
        username=user.username,
        email=user.email.lower(),
        hashed_password=hash_password(user.plain_password),
    )
    # Add and commit are like staging and committing changes
    db.add(new_user)
    await db.commit()
    # Refresh will get an up-to-date version of the object from database
    await db.refresh(new_user)
    # Return it right after
    return new_user


@router.post("/token", response_model=Token)
async def login_for_access_token(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # Look up user by email
    result = await db.execute(
        select(models.User).where(
            func.lower(models.User.email) == form_data.username.lower(),
        ),
    )
    user = result.scalars().first()

    # Verify password
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Create token and return it
    access_token_expires = timedelta(minutes=settings.access_token_expire_minutes)
    access_token = create_access_token(
        data={"sub": str(user.id)},
        expires_delta=access_token_expires,
    )
    return Token(access_token=access_token, token_type="Bearer")


# This goes before the get user_id route because it's best practice to put specific routes
# before parameterized ones
# This endpoint is important because the frontend needs to know who is logged in
# Calling this endpoint validates that the token is still good
# Standard pattern used by a lot of APIs
@router.get("/me", response_model=UserPrivate)
async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
):
    user_id = verify_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    # Convert user id to integer with some defensive error handling
    # If we cannot convert to integer, then the JWT is invalid
    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    result = await db.execute(select(models.User).where(models.User.id == user_id_int))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# Get user from database
@router.get("/{user_id}", response_model=UserPublic)
async def get_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


# Get user snippets
@router.get("/{user_id}/snippets", response_model=list[SnippetResponse])
async def get_user_snippets(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    result = await db.execute(
        # Select from snippets table where the owner id of that snippet matches the
        # requested user id
        # select(models.Snippet).where(models.Snippet.owner_id == user_id)
        # Need to test these two, above is what I think works and below is the Corey tutorial
        # Supposedly it's because the response requires the owner object, not just the id
        # Select from snippets table, load in the owners of each snippet where
        # the owner's id matches the requested user id
        select(models.Snippet)
        .options(selectinload(models.Snippet.owner))
        .where(models.Snippet.owner_id == user_id)
    )
    snippets = result.scalars().all()
    return snippets


# Get all users from database
@router.get("", response_model=list[UserPublic])
async def get_all_users(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User))
    users = result.scalars().all()
    return users


# Not sure if this is necessary because users shouldn't be changing their entire profile
# @router.put("/{user_id}", response_model=UserPrivate)
# async def update_user_full(
#     user_id: int, updated_user: UserCreate, db: Annotated[AsyncSession, Depends(get_db)]
# ):
#     # Get user to update
#     result = await db.execute(select(models.User).where(models.User.id == user_id))
#     user_to_update = result.scalars().first()
#     if not user_to_update:
#         raise HTTPException(
#             status_code=status.HTTP_404_NOT_FOUND,
#             detail="User not found",
#         )
#
#     # If we are changing username, make sure the username is not taken
#     if updated_user.username.lower() != user_to_update.username.lower():
#         result = await db.execute(
#             select(models.User).where(
#                 func.lower(models.User.username) == updated_user.username.lower()
#             )
#         )
#         existing_user = result.scalars().first()
#         if existing_user:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Username already exists",
#             )
#
#     # If we are changing email, make sure the email is not taken
#     if updated_user.email.lower() != user_to_update.email.lower():
#         result = await db.execute(
#             select(models.User).where(
#                 func.lower(models.User.email) == updated_user.email.lower()
#             )
#         )
#         existing_email = result.scalars().first()
#         if existing_email:
#             raise HTTPException(
#                 status_code=status.HTTP_400_BAD_REQUEST,
#                 detail="Email is already registered",
#             )
#     # Update and commit changes
#     # for key, val in updated_user.model_dump(exclude_unset=True).items():
#     #     setattr(user_to_update, key, val)
#     # We don't use model_dump here because we need to modify the user email
#     user_to_update.username = updated_user.username
#     user_to_update.email = updated_user.email.lower()
#     user_to_update.hashed_password = hash_password(updated_user.plain_password)
#
#     await db.commit()
#     await db.refresh(user_to_update)
#     return user_to_update


@router.patch("/{user_id}", response_model=UserPrivate)
async def update_user(
    user_id: int, updated_user: UserUpdate, db: Annotated[AsyncSession, Depends(get_db)]
):
    # Get user to update
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user_to_update = result.scalars().first()
    if not user_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )

    # If we are changing username, make sure the username is not taken
    if (
        updated_user.username is not None
        and updated_user.username.lower() != user_to_update.username.lower()
    ):
        result = await db.execute(
            select(models.User).where(
                func.lower(models.User.username) == updated_user.username.lower()
            )
        )
        existing_user = result.scalars().first()
        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Username already exists",
            )

    # If we are changing email, make sure the email is not taken
    if (
        updated_user.email is not None
        and updated_user.email.lower() != user_to_update.email.lower()
    ):
        result = await db.execute(
            select(models.User).where(
                func.lower(models.User.email) == updated_user.email.lower()
            )
        )
        existing_email = result.scalars().first()
        if existing_email:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email is already registered",
            )

    # Update and commit changes
    # for key, val in updated_user.model_dump(exclude_unset=True).items():
    #     setattr(user_to_update, key, val)
    # We don't use model_dump here because we need to modify the user email
    if updated_user.username is not None:
        user_to_update.username = updated_user.username
    if updated_user.email is not None:
        user_to_update.email = updated_user.email.lower()
    if updated_user.plain_password is not None:
        user_to_update.hashed_password = hash_password(updated_user.plain_password)

    await db.commit()
    await db.refresh(user_to_update)
    return user_to_update


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_user(user_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.User).where(models.User.id == user_id))
    user_to_delete = result.scalars().first()
    if not user_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    await db.delete(user_to_delete)
    await db.commit()
    return None
