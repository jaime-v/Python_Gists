# schemas.py
"""
File for storing all of the Pydantic schemas

Pydantic schemas are used to essentially add type safety to our functions
We are specifying what goes in and what comes out of our API
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# class ItemIn(BaseModel):
#     name: str
#     price: float
#     is_offer: Optional[bool] = None
#     id: int
#
#
# class ItemOut(BaseModel):
#     name: str
#     price: float
#     is_offer: Optional[bool] = None
#     id: int


class UserCreate(BaseModel):
    username: str
    email: str
    password: str


class UserOut(BaseModel):
    username: str
    email: str

    # Allows reading from SQLAlchemy objects
    class Config:
        from_attributes = True

class SnippetCreate(BaseModel):
    title: str
    language: str
    description: str
    code: str

class SnippetOut(BaseModel):
    title: str
    language: str
    description: str
    code: str
    owner: UserOut
    creation_date: datetime
    last_updated_date: datetime

    class Config:
        from_attributes = True



# Testing for security purposes
class TestUser(BaseModel):
    username: str
    email: str | None = None
    full_name: str | None = None
    disabled: bool | None = None


class TestUserInDB(TestUser):
    hashed_password: str


class TestToken(BaseModel):
    access_token: str
    token_type: str


class TestTokenData(BaseModel):
    # This was in the docs, but it keeps giving me error?
    # username: str | None = None
    username: str
