"""
routers/snippets.py

Defines the routes/endpoints in the API for snippets
"""

from fastapi import Depends, status, APIRouter, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated


from app.schemas import (
    SnippetCreate,
    SnippetUpdate,
    SnippetResponse,
)
from app.db import get_db
import app.models as models

# Traversy Media puts prefix as /api/v1/items
router = APIRouter(prefix="/api/snippets", tags=["snippets"])


# Snippets
@router.post("", response_model=SnippetResponse, status_code=status.HTTP_201_CREATED)
async def create_snippet(
    snippet: SnippetCreate, db: Annotated[AsyncSession, Depends(get_db)]
):
    # Verify that user exists before creating the new snippet
    result = await db.execute(
        select(models.User).where(models.User.id == snippet.owner_id)
    )
    user = result.scalars().first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    new_snippet = models.Snippet(
        title=snippet.title,
        language=snippet.language,
        description=snippet.description,
        code=snippet.code,
        owner_id=snippet.owner_id,
    )
    db.add(new_snippet)
    await db.commit()
    await db.refresh(new_snippet)
    return new_snippet


@router.get("/{snippet_id}", response_model=SnippetResponse)
async def get_snippet(snippet_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(
        select(models.Snippet).where(models.Snippet.id == snippet_id)
    )
    snippet = result.scalars().first()
    if not snippet:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )
    return snippet


@router.get("")
async def get_snippets(db: Annotated[AsyncSession, Depends(get_db)]):
    result = await db.execute(select(models.Snippet))
    snippets = result.scalars().all()
    return snippets


@router.put("/{snippet_id}", response_model=SnippetResponse)
async def update_snippet_full(
    snippet_id: int,
    updated_snippet: SnippetCreate,
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
    # If the updated snippet has a different owner, then check to make sure the new owner exists
    if updated_snippet.owner_id != snippet_to_update.owner_id:
        result = await db.execute(
            select(models.User.id).where(models.User.id == updated_snippet.owner_id)
        )
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
    snippet_to_update.title = updated_snippet.title
    snippet_to_update.language = updated_snippet.language
    snippet_to_update.description = updated_snippet.description
    snippet_to_update.code = updated_snippet.code
    snippet_to_update.owner_id = updated_snippet.owner_id
    await db.commit()
    await db.refresh(snippet_to_update)
    return snippet_to_update


@router.patch("/{snippet_id}", response_model=SnippetResponse)
async def update_snippet_partial(
    snippet_id: int,
    updated_snippet: SnippetUpdate,
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
    # If the updated snippet has a different owner, then check to make sure the new owner exists
    if updated_snippet.owner_id != snippet_to_update.owner_id:
        result = await db.execute(
            select(models.User.id).where(models.User.id == updated_snippet.owner_id)
        )
        user = result.scalars().first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found",
            )
    for key, val in updated_snippet.model_dump(exclude_unset=True).items():
        setattr(snippet_to_update, key, val)
    await db.commit()
    await db.refresh(snippet_to_update)
    return snippet_to_update


@router.delete("/{snippet_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_snippet(snippet_id: int, db: Annotated[AsyncSession, Depends(get_db)]):
    snippet_to_delete = db.execute(
        select(models.Snippet).where(models.Snippet.id == snippet_id)
    )
    if not snippet_to_delete:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Snippet not found",
        )
    await db.delete(snippet_to_delete)
    await db.commit()
    return None
