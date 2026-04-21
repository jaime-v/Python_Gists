"""
models.py

Used for defining database models (tables)

Current tables are the 'users' table with User and 'snippets' table with Snippet
"""

from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship, Mapped, mapped_column
from datetime import datetime, timezone

from app.db import Base


# Unique IDs are automatically created by PostgreSQL
# Don't know if I need the nullable for ID, I don't think I do
class User(Base):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    username: Mapped[str] = mapped_column(String(50), unique=True, nullable=False, index=True)
    email: Mapped[str] = mapped_column(String(120), unique=True, nullable=False, index=True)
    hashed_password: Mapped[str] = mapped_column(String(200), nullable=False)
    # is_active = Column(Boolean, default=True)

    snippets: Mapped[list[Snippet]] = relationship(
        "Snippet",
        back_populates="owner",
        cascade="all, delete-orphan",
    )


class Snippet(Base):
    __tablename__ = "snippets"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    language: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    code: Mapped[str] = mapped_column(String)
    owner_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    creation_date: Mapped[datetime] = mapped_column(
        DateTime, default=datetime.now(timezone.utc)
    )
    last_updated_date: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.now(timezone.utc),
        onupdate=datetime.now(timezone.utc),
    )

    # deprecated
    # creation_date = Column(DateTime, default=datetime.utcnow)

    # Not sure when relationship is useful, i just have it in because of devsheets
    owner = relationship("User", back_populates="snippets")


# class Item(Base):
#     __tablename__ = "items"
#
#     id = Column(Integer, primary_key=True, index=True)
#     title = Column(String, index=True)
#     description = Column(String)
#     price = Column(Float)
#     owner_id = Column(Integer, ForeignKey("users.id"))
#
#     owner = relationship("User", back_populates="items")
