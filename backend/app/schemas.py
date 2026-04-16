"""
schemas.py

File for storing all of the Pydantic schemas

Pydantic schemas are used to essentially add type safety to our functions
We are specifying what goes in and what comes out of our API
"""

from pydantic import BaseModel, Field
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


# Pydantic schema that our API will expect when creating a user
# I assume it's plain password, then we hash internally
class UserCreate(BaseModel):
    username: str
    email: str
    plain_password: str

# Schema for a response using the created User's data
class UserOut(BaseModel):
    username: str
    email: str

    # Allows reading from SQLAlchemy objects
    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    hashed_password: Optional[str] = Field(default=None)


# Schema for creating a snippet
class SnippetCreate(BaseModel):
    title: str
    language: str
    description: str
    code: str

# Schema for a created snippet -- inherits from SnippetCreate because we want to 
# dsisplay that information as well
class SnippetOut(SnippetCreate):
    owner: UserOut
    creation_date: datetime
    last_updated_date: datetime

    class Config:
        from_attributes = True

# Update snippet -- its in the name
class SnippetUpdate(BaseModel):
    title: Optional[str] = Field(default=None)
    language: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    code: Optional[str] = Field(default=None)



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
