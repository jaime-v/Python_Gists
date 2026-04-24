"""
routers/snippets.py

Defines the routes/endpoints in the API for snippets
"""

from fastapi import Depends, status, APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated

from app.schemas import (
    SnippetCreate,
    SnippetUpdate,
    SnippetResponse,
)
from app.db import get_db
from app.auth import CurrentUser
import app.models as models

# Traversy Media puts prefix as /api/v1/items
router = APIRouter(prefix="/api/snippets", tags=["snippets"])


# Snippets
# By adding the CurrentUser parameter that we created in auth.py, this route becomes
# protected, meaning that anyone that calls this route must have a valid token, otherwise
# they will get an unauthorized error
# Can also use the current user to directly get the id because current user is of the same
# model as User
@router.post("", response_model=SnippetResponse, status_code=status.HTTP_201_CREATED)
async def create_snippet(
    snippet: SnippetCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    # This has become obsolete since we verify the user exists inside CurrentUser dependency
    # # Verify that user exists before creating the new snippet
    # result = await db.execute(
    #     select(models.User).where(models.User.id == snippet.owner_id)
    # )
    # user = result.scalars().first()
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="User not found",
    #     )
    new_snippet = models.Snippet(
        title=snippet.title,
        language=snippet.language,
        description=snippet.description,
        code=snippet.code,
        owner_id=current_user.id,
    )
    db.add(new_snippet)
    await db.commit()
    # Need the owner for the response apparently
    await db.refresh(new_snippet, attribute_names=["owner"])
    return new_snippet


@router.get("/{snippet_id}", response_model=SnippetResponse)
async def get_snippet(snippet_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        # select(models.Snippet).where(models.Snippet.id == snippet_id)
        select(models.Snippet)
        .options(selectinload(models.Snippet.owner))
        .where(models.Snippet.id == snippet_id)
    )
    snippet = result.scalars().first()
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )
    return snippet


@router.get("", response_model=list[SnippetResponse])
async def get_snippets(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.Snippet).options(selectinload(models.Snippet.owner))
    )
    snippets = result.scalars().all()
    return snippets


# Adding in CurrentUser dependency to update routes because users shouldn't be
# able to edit other users' posts
# Removing transferring ownership functionality for now, but it's something I want to add back
# I feel like it should be easy, just need to provide the updated user id, verify current user,
# and change the owner, but maybe there's something im missing...
@router.put("/{snippet_id}", response_model=SnippetResponse)
async def update_snippet_full(
    snippet_id: int,
    updated_snippet: SnippetCreate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):

    # If snippet doesn't exist, then error
    result = await db.execute(
        select(models.Snippet).where(models.Snippet.id == snippet_id)
    )
    snippet_to_update = result.scalars().first()
    if not snippet_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )

    # If current_user is not the owner, then error
    if snippet_to_update.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this snippet",
        )

    # If the updated owner doesn't exist, then error
    # result = await db.execute(
    #     select(models.User.id).where(models.User.id == updated_snippet.owner_id)
    # )
    # user = result.scalars().first()
    # if not user:
    #     raise HTTPException(
    #         status_code=status.HTTP_404_NOT_FOUND,
    #         detail="User not found",
    #     )
    snippet_to_update.title = updated_snippet.title
    snippet_to_update.language = updated_snippet.language
    snippet_to_update.description = updated_snippet.description
    snippet_to_update.code = updated_snippet.code
    snippet_to_update.owner_id = current_user.id
    await db.commit()
    await db.refresh(snippet_to_update, attribute_names=["owner"])
    return snippet_to_update


# Similar story here, removing transferring ownership for now
@router.patch("/{snippet_id}", response_model=SnippetResponse)
async def update_snippet_partial(
    snippet_id: int,
    updated_snippet: SnippetUpdate,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(models.Snippet).where(models.Snippet.id == snippet_id)
    )
    snippet_to_update = result.scalars().first()
    # If snippet doesn't exist, then error
    if not snippet_to_update:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )

    # If snippet owner is not current user, then error
    if snippet_to_update.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to update this snippet",
        )

    # If the updated snippet has a different owner, then check to make sure the new owner exists
    # if (
    #     updated_snippet.owner_id is not None
    #     and updated_snippet.owner_id != snippet_to_update.owner_id
    # ):
    #     result = await db.execute(
    #         select(models.User.id).where(models.User.id == updated_snippet.owner_id)
    #     )
    #     user = result.scalars().first()
    #     if not user:
    #         raise HTTPException(
    #             status_code=status.HTTP_404_NOT_FOUND,
    #             detail="User not found",
    #         )
    for key, val in updated_snippet.model_dump(exclude_unset=True).items():
        setattr(snippet_to_update, key, val)
    await db.commit()
    await db.refresh(snippet_to_update, attribute_names=["owner"])
    return snippet_to_update


@router.delete("/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(
    snippet_id: int,
    current_user: CurrentUser,
    db: Annotated[AsyncSession, Depends(get_db)],
):
    result = await db.execute(
        select(models.Snippet).where(models.Snippet.id == snippet_id)
    )
    snippet_to_delete = result.scalars().first()
    if not snippet_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )

    if snippet_to_delete.owner_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not authorized to delete this snippet",
        )
    await db.delete(snippet_to_delete)
    await db.commit()
    return None
