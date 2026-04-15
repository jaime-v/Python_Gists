"""
db.py

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
# Create tables if they don't exist
Base.metadata.create_all(bind=engine)
