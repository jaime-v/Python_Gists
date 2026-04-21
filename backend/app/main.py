"""
main.py

Driver for the code
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers import users, snippets
from app.middleware import timing
from app.db import engine, get_db

# @asynccontextmanager
# async def lifespan(_app: FastAPI):
#     yield
#     await engine.dispose()

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
async def get_root():
    return {"Root": "Root"}
