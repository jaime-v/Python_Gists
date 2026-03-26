# db.py
"""
For managing the database connection and creating our tables
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Devsheets Suggestion
# DATABASE_URL = "sqlite.///./app.db"
load_dotenv()

# Good practice to add a fallback database, but I don't have that currently
DATABASE_URL = os.getenv(
    "DATABASE_URL", "postgresql://postgres:postgres@localhost/gists"
)

# Engine is connection configuration
engine = create_engine(DATABASE_URL)

# SessionLocal is a sessionmaker, is creates sessions
# Sessions are actual connections to the database
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is registry of all the tables
Base = declarative_base()


# Open a session, use it, then close it
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# I think this should be its own file, but idk
# models.py
from sqlalchemy import Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.orm import relationship

"""
These will be used for our tables in the database
"""


# Unique IDs are automatically created by PostgreSQL
class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)

    items = relationship("Item", back_populates="owner")


class Item(Base):
    __tablename__ = "items"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    description = Column(String)
    price = Column(Float)
    owner_id = Column(Integer, ForeignKey("users.id"))

    owner = relationship("User", back_populates="items")


# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
