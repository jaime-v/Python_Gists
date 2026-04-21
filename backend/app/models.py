"""
models.py

Used for defining database models (tables)

Current tables are the 'users' table with User and 'snippets' table with Snippet
"""

from __future__ import annotations

# This is important for forward referencing (Accessing something that is defined later)
# Not needed in Python 3.14, which is what we are using, but might as well have it in case
# people don't use Python 3.14

from sqlalchemy import Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime, UTC

from app.db import Base


# Unique IDs are automatically created by PostgreSQL
# Don't know if I need the nullable for ID, I don't think I do
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(
        String(50), unique=True, nullable=False, index=True
    )
    email: Mapped[str] = mapped_column(
        String(120), unique=True, nullable=False, index=True
    )
    hashed_password: Mapped[str] = mapped_column(String(200), nullable=False)
    # is_active = Column(Boolean, default=True)

    snippets: Mapped[list[Snippet]] = relationship(
        "Snippet",
        back_populates="owner",
        cascade="all, delete-orphan",
    )
    # enables user.snippets to get all snippets


class Snippet(Base):
    __tablename__ = "snippets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String(50), index=True)
    language: Mapped[str] = mapped_column(String(50))
    description: Mapped[str] = mapped_column(String(500))
    code: Mapped[str] = mapped_column(String(500))
    owner_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("users.id"), nullable=False, index=True
    )
    # Not sure what lambda does exactly, but apparently it's like an inline anon function
    creation_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), default=lambda: datetime.now(UTC)
    )
    last_updated_date: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
    )

    # deprecated
    # creation_date = Column(DateTime, default=datetime.utcnow)
    owner = relationship("User", back_populates="snippets")
    # enables snippet.owner and get a user
