"""
schemas.py

File for storing all of the Pydantic schemas

Pydantic schemas are used to essentially add type safety to our functions
We are specifying what goes in and what comes out of our API
"""

from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import Optional
from datetime import datetime


# Pydantic schema for the base of each user
class UserBase(BaseModel):
    username: str = Field(min_length=1, max_length=50)
    email: EmailStr = Field(max_length=120)


# On creation, we also need the user password
class UserCreate(UserBase):
    plain_password: str = Field(min_length=8)


# Separate UserResponse schema into public and private


# If a user wants their own information, they can see it all
# If a different user requests another user's information,
# they receive only publicly available information
class UserPublic(BaseModel):
    # Modern version of class Config
    model_config = ConfigDict(from_attributes=True)
    id: int
    username: str

    # Allows reading from SQLAlchemy objects
    # class Config:
    #     from_attributes = True


class UserPrivate(UserPublic):
    email: EmailStr


# Update user schema has optional fields
class UserUpdate(BaseModel):
    username: Optional[str] = Field(default=None)
    email: Optional[str] = Field(default=None)
    hashed_password: Optional[str] = Field(default=None)


class SnippetBase(BaseModel):
    title: str = Field(min_length=1, max_length=50)
    language: str = Field(min_length=1, max_length=50)
    description: str = Field(min_length=1, max_length=500)
    code: str = Field(min_length=1, max_length=500)
    owner_id: int


# Schema for creating a snippet
class SnippetCreate(SnippetBase):
    pass


# Schema for a created snippet -- inherits from SnippetCreate because we want to
# dsisplay that information as well
class SnippetResponse(SnippetBase):
    model_config = ConfigDict(from_attributes=True)
    owner: UserPublic
    creation_date: datetime
    last_updated_date: datetime

    # class Config:
    #     from_attributes = True


# Update snippet -- its in the name
class SnippetUpdate(BaseModel):
    title: Optional[str] = Field(default=None)
    language: Optional[str] = Field(default=None)
    description: Optional[str] = Field(default=None)
    code: Optional[str] = Field(default=None)


class Token(BaseModel):
    access_token: str
    token_type: str
