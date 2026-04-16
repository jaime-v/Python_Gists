"""
models.py

Used for defining database models (tables)

Current tables are the 'users' table with User and 'snippets' table with Snippet
"""
from sqlalchemy import Column, Integer, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone

from app.db import Base

# Unique IDs are automatically created by PostgreSQL
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    # is_active = Column(Boolean, default=True)

    snippets = relationship("Snippet", back_populates="owner")

class Snippet(Base):
    __tablename__ = "snippets"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    language = Column(String)
    description = Column(String)
    code = Column(String)
    owner_id = Column(Integer, ForeignKey("users.id"))
    creation_date = Column(DateTime, default=datetime.now(timezone.utc))
    last_updated_date = Column(
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


