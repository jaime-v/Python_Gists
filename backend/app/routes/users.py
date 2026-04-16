"""
routes/users.py

Defines the routes/endpoints in the API for users
"""

from fastapi import Depends, status, APIRouter
from sqlalchemy.orm import Session

from app.schemas import (
    UserCreate,
    UserUpdate,
    UserOut,
)
from app.db import get_db
from app.models import User

router = APIRouter(prefix="/users", tags=["users"])

# Basic routes would just be CRUD for User and Snippet
# Let's hardcode it for now


# Get user from database
@router.get("/{user_id}/", response_model=UserOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # I think this is a query to the User table (class?) filters by user id and
    # then gets the first row
    # Then it returns that row?
    
    # Currently this just returns 500 if user id does not exist, but should
    # return a 404
    return db.query(User).filter(User.id == user_id).first()


# Get all users from database
@router.get("/")
async def get_all_users(db: Session = Depends(get_db)):
    # Is this like an array? object?
    return db.query(User).all()


# Create user in database
@router.post("/", response_model=UserOut, status_code=status.HTTP_201_CREATED)
async def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # UserCreate has username, email, password
    # hashed = hash_password(user.password)

    # For now just send plain-text
    hashed = user.plain_password
    new_user = User(username=user.username, email=user.email, hashed_password=hashed)
    # Add and commit are like staging and committing changes
    db.add(new_user)
    db.commit()
    # Refresh will get an up-to-date version of the object from database
    db.refresh(new_user)
    # Return it right after
    return new_user


@router.put("/{user_id}/", response_model=UserOut)
async def update_user(
    user_id: int, updated_user: UserUpdate, db: Session = Depends(get_db)
):

    # Got this from devsheets
    # Looks like it converts updated_user into dictionary and replaces the keys
    # with the values inside the user_to_update
    # But we should have hashed password instead of plain...
    # Should I get a new schema just for that? why not
    user_to_update = db.query(User).filter(User.id == user_id).first()
    for key, val in updated_user.model_dump(exclude_unset=True).items():
        setattr(user_to_update, key, val)
    db.commit()
    db.refresh(user_to_update)
    return user_to_update


@router.delete(
    "/{user_id}/", status_code=status.HTTP_204_NO_CONTENT
)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    db.delete(user_to_delete)
    db.commit()
    return None


