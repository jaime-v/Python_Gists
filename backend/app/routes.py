"""
routes.py

Defines the routes/endpoints in the API
"""
from fastapi import Depends, status
from sqlalchemy.orm import Session

from app.schemas import (
    UserCreate,
    UserOut,
    SnippetCreate,
    SnippetOut,
)
from app.db import get_db
from app.models import User, Snippet

from app.main import app

# Basic routes would just be CRUD for User and Snippet
# Let's hardcode it for now

# Get user from database
@app.get("/user/{user_id}/", response_model=UserOut)
async def get_user(user_id: int, db: Session = Depends(get_db)):
    # I think this is a query to the User table (class?) filters by user id and
    # then gets the first row
    # Then it returns that row?
    return db.query(User).filter(User.id == user_id).first()

# Get all users from database
@app.get("/user/")
async def get_all_users(db: Session = Depends(get_db)):
    # Is this like an array? object?
    return db.query(User).all()

# Create user in database
@app.post("/user/", response_model=UserOut)
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


@app.put("/user/{user_id}/", response_model=UserOut)
async def update_user(
    user_id: int, updated_user: UserCreate, db: Session = Depends(get_db)
):
    user_to_update = db.query(User).filter(User.id == user_id).first()
    user_to_update = updated_user
    db.commit()
    db.refresh(user_to_update)
    return user_to_update


@app.delete(
    "/user/{user_id}/", response_model=UserOut, status_code=status.HTTP_201_CREATED
)
async def delete_user(user_id: int, db: Session = Depends(get_db)):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    db.delete(user_to_delete)
    db.commit()
    return user_to_delete

# Snippets
@app.get("/snippet/{snippet_id}/", response_model=SnippetOut)
async def get_snippet(snippet_id: int, db: Session = Depends(get_db)):
    return db.query(Snippet).filter(Snippet.id == snippet_id).first()

@app.get("/snippet/")
async def get_snippets(db: Session = Depends(get_db)):
    return db.query(Snippet).all();

@app.post("/snippet/", response_model=SnippetOut)
async def create_snippet(snippet: SnippetCreate, db: Session = Depends(get_db)):
    new_snippet = snippet
    db.add(new_snippet)
    db.commit()
    db.refresh(new_snippet)
    return new_snippet

@app.put("/snippet/{snippet_id}/", response_model=SnippetOut)
async def update_snippet(snippet_id: int, updated_snippet: SnippetCreate, db: Session = Depends(get_db)):
    snippet_to_update = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    snippet_to_update = updated_snippet
    db.commit()
    db.refresh(snippet_to_update)
    return snippet_to_update

# Do delete methods even have content to return? No. it literally says on the status code
@app.delete("/snippet/{snippet_id}/", response_model=SnippetOut, status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(snippet_id: int, db: Session = Depends(get_db)):
    snippet_to_delete = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    db.delete(snippet_to_delete)
    db.commit()
    return snippet_to_delete
# After that, Snippet Creation, Update, Delete must require the User that created it


