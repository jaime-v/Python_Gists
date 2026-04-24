"""
auth.py

Authentication utilities module
Probably best to put this in services subdirectory
"""

from datetime import UTC, datetime, timedelta
from fastapi.security import OAuth2PasswordBearer
from pwdlib import PasswordHash
from config import settings
import jwt

# Need some more imports
from typing import Annotated
from fastapi import status, HTTPException, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
import app.models as models
from app.db import get_db

# Just uses recommended security configuration in the password hasher
password_hash = PasswordHash.recommended()

# OAuth2 Scheme extracts the token from the authorization header
# The tokenUrl is the same url as our login route
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/users/token")


# Hashing is better than encrypting because hashing is not reversible
def hash_password(password: str) -> str:
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return password_hash.verify(plain_password, hashed_password)


"""
Create a JWT Token by getting a copy of the data, adding an expiration time, and encoding it as a jwt
"""


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(
            minutes=settings.access_token_expire_minutes,
        )
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.secret_key.get_secret_value(),
        algorithm=settings.algorithm,
    )
    return encoded_jwt


"""
Verify a JWT token and return the user id (subject) if valid
"""


def verify_access_token(token: str):
    try:
        payload = jwt.decode(
            token,
            settings.secret_key.get_secret_value(),
            algorithms=[settings.algorithm],
            options={"require": ["exp", "sub"]},
        )
    except jwt.InvalidTokenError:
        return None
    else:
        return payload.get("sub")


# Need a reusable dependency that can look up the user in the database and return the
# user object
# This is different from /me, which is an endpoint that the user can call for
# We need a dependency that we use internally so that routes can require authentication

"""
Any route that users this dependency will automatically require a valid token, and
receive a valid user object

Takes a token from the oauth2 authorization scheme we have set
Also takes a database session

Verify the access token, raise a 401-unauthorized if invalid
Try to convert the token to an int, raise a 401-unauthorized if token has type or value error
    (which means it has been tampered with i think)
Find the user in the database
If user does not exist, then return a 401? With user not found? Idk why it's not 404
Then return user

This is just the /me function though, so we replaced that route
"""


async def get_current_user(
    token: Annotated[str, Depends(oauth2_scheme)],
    db: Annotated[AsyncSession, Depends(get_db)],
) -> models.User:
    user_id = verify_access_token(token)
    if user_id is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or Expired Token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        user_id_int = int(user_id)
    except (TypeError, ValueError):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or Expired Token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    result = await db.execute(select(models.User).where(models.User.id == user_id_int))
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user


# To make things even easier, we make a type alias
CurrentUser = Annotated[models.User, Depends(get_current_user)]
