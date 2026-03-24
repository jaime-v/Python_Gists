# schemas.py
"""
File for storing all of the Pydantic schemas

Pydantic schemas are used to essentially add type safety to our functions
We are specifying what goes in and what comes out of our API
"""
from pydantic import BaseModel
from typing import Optional

class ItemIn(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None
    id: int

class ItemOut(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None
    id: int

class UserIn(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    username: str
    email: str
    
    # Allows reading from SQLAlchemy objects
    class Config:
        from_attributes = True

