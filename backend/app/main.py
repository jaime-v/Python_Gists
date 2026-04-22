"""
main.py

Driver for the code
"""

from contextlib import asynccontextmanager

# For the lifespan function

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

# from fastapi.exception_handlers import (
#     http_exception_handler,
#     request_validation_exception_handler,
# )

from app.routers import users, snippets
from app.middleware import timing
from app.db import engine, get_db, Base


# Lifespan handles on startup and on shutdown events
@asynccontextmanager
async def lifespan(_app: FastAPI):
    # Startup
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    yield
    # Shutdown
    await engine.dispose()


# App starts here
# app = FastAPI(lifespan=lifespan)
app = FastAPI()

app.include_router(users.router)
app.include_router(snippets.router)

app.middleware("http")(timing.timing_middleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# Just a root get
@app.get("/")
def get_root():
    return {"Root": "Root"}
