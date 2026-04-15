"""
routers/snippets.py

Defines the routes/endpoints in the API for snippets
"""

from fastapi import Depends, status, APIRouter
from sqlalchemy.orm import Session

from app.schemas import (
    SnippetCreate,
    SnippetOut,
)
from app.db import get_db
from app.models import Snippet

router = APIRouter()


# Snippets
@router.get("/snippet/{snippet_id}/", response_model=SnippetOut)
async def get_snippet(snippet_id: int, db: Session = Depends(get_db)):
    return db.query(Snippet).filter(Snippet.id == snippet_id).first()

@router.get("/snippet/")
async def get_snippets(db: Session = Depends(get_db)):
    return db.query(Snippet).all()

@router.post("/snippet/", response_model=SnippetOut)
async def create_snippet(snippet: SnippetCreate, db: Session = Depends(get_db)):
    new_snippet = snippet
    db.add(new_snippet)
    db.commit()
    db.refresh(new_snippet)
    return new_snippet

@router.put("/snippet/{snippet_id}/", response_model=SnippetOut)
async def update_snippet(
    snippet_id: int, updated_snippet: SnippetCreate, db: Session = Depends(get_db)
):
    snippet_to_update = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    snippet_to_update = updated_snippet
    db.commit()
    db.refresh(snippet_to_update)
    return snippet_to_update

@router.delete(
    "/snippet/{snippet_id}/",
    status_code=status.HTTP_204_NO_CONTENT
)
async def delete_snippet(snippet_id: int, db: Session = Depends(get_db)):
    snippet_to_delete = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    db.delete(snippet_to_delete)
    db.commit()
    return None


# After that, Snippet Creation, Update, Delete must require the User that created it
