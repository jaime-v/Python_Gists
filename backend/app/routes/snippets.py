"""
routes/snippets.py

Defines the routes/endpoints in the API for snippets
"""

from fastapi import Depends, status, APIRouter
from sqlalchemy.orm import Session

from app.schemas import (
    SnippetCreate,
    SnippetUpdate,
    SnippetOut,
)
from app.db import get_db
from app.models import Snippet

# Traversy Media puts prefix as /api/v1/items
router = APIRouter(prefix="/snippets", tags=["snippets"])


# Snippets
@router.get("/{snippet_id}/", response_model=SnippetOut)
async def get_snippet(snippet_id: int, db: Session = Depends(get_db)):
    return db.query(Snippet).filter(Snippet.id == snippet_id).first()


@router.get("/")
async def get_snippets(db: Session = Depends(get_db)):
    return db.query(Snippet).all()


#
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     language = Column(String)
#     description = Column(String)
#     code = Column(String)
#     owner_id = Column(Integer, ForeignKey("users.id"))
#     creation_date = Column(DateTime, default=datetime.now(timezone.utc))
#     last_updated_date = Column(
#         DateTime,
#         default=datetime.now(timezone.utc),
#         onupdate=datetime.now(timezone.utc),
#     )
#
# # Schema for creating a snippet
# class SnippetCreate(BaseModel):
#     title: str
#     language: str
#     description: str
#     code: str
#
#


@router.post("/", response_model=SnippetOut)
async def create_snippet(snippet: SnippetCreate, db: Session = Depends(get_db)):
    new_snippet = Snippet(
        title=snippet.title,
        language=snippet.language,
        description=snippet.description,
        code=snippet.code,
        owner_id=2
    )
    db.add(new_snippet)
    db.commit()
    db.refresh(new_snippet)
    return new_snippet


@router.put("/{snippet_id}/", response_model=SnippetOut)
async def update_snippet(
    snippet_id: int, updated_snippet: SnippetUpdate, db: Session = Depends(get_db)
):
    snippet_to_update = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    for key, val in updated_snippet.model_dump(exclude_unset=True).items():
        setattr(snippet_to_update, key, val)
    db.commit()
    db.refresh(snippet_to_update)
    return snippet_to_update


@router.delete("/{snippet_id}/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(snippet_id: int, db: Session = Depends(get_db)):
    snippet_to_delete = db.query(Snippet).filter(Snippet.id == snippet_id).first()
    db.delete(snippet_to_delete)
    db.commit()
    return None


# After that, Snippet Creation, Update, Delete must require the User that created it
