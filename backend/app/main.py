from fastapi import FastAPI, status, Depends, HTTPException, Query
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Annotated
from pydantic import BaseModel

# FastAPI Docs suggestion
# from sqlmodel import Field, Session, SQLModel, create_engine, select

# Devsheets suggestion
from sqlalchemy import create_engine, Column, Integer, String, Boolean, Float, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, Session, relationship

class ItemIn(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None
    id: int

class UserIn(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    username: str
    email: str

items = []

# Devsheets Suggestion
DATABASE_URL = "sqlite.///./app.db"
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

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

Base.metadata.create_all(bind=engine)

# Docs Suggestion
# class Hero(SQLModel, table=True):
#     id: int | None = Field(default=None, primary_key=True)
#     name: str = Field(index=True)
#     age: int | None = Field(default=None, index=True)
#     secret_name: str
#
# sqlite_filename = "database.db"
# sqlite_url = f"sqlite:///{sqlite_filename}"
#
# connect_args = {"check_same_thread": False}
# engine = create_engine(sqlite_url, connect_args=connect_args)
#
# def create_db_and_tables():
#     SQLModel.metadata.create_all(engine)
#
# def get_session():
#     with Session(engine) as session:
#         yield session
#
# SessionDep = Annotated[Session, Depends(get_session)]

# App starts here
app = FastAPI()

# Docs outdated?
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()

app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_methods=["*"],
        allow_headers=["*"],
        )

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

async def common_params(q: str = "Supposedly None", skip: int = 0):
    return{"q": q, "skip": skip}

@app.get("/")
async def root():
    return {"message": "Hello World!"}

@app.get("/protected/")
async def protected(token: str = Depends(oauth2_scheme)):
    return {"token": token}

@app.get("/users/{username}")
async def get_user(username: str):
    return {"username": username}

@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn, db: Session = Depends(get_db)):
    db_user = User(email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user

@app.get("/search/")
async def search(q: Optional[str] = None):
    return {"query": q}

# @app.get("/items/")
# async def get_items(skip: int = 0, limit: int = 10):
#     return {"skip": skip, "limit": limit}
@app.get("/commons/")
async def get_commons(commons: dict = Depends(common_params)):
    return commons

@app.get("/items/")
async def get_items():
    return items

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemIn):
    items.append(item)
    return item

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    print(type(items[0]))
    items_by_id = {item.id : item for item in items}
    item = items_by_id.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
    """
    for item in items:
        if item_id == item.id:
            return item
    is_present = any(item.id == item_id for item in items)
    if not is_present:
        raise HTTPException(
                status_code=404,
                detail="Item not found"
                )
    return items[item_id]
    """

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: ItemIn):
    return {"item_id": item_id, "item": item.model_dump()}

@app.delete("/items/${item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    print(item_id)
    return None

# @app.post("/heroes/")
# def create_hero(hero: Hero, session: SessionDep) -> Hero:
#     session.add(hero)
#     session.commit()
#     session.refresh(hero)
#     return hero
#
# @app.get("/heroes/")
# def get_heroes(
#         session: SessionDep, 
#         offset: int = 0, 
#         limit: Annotated[int, Query(le=100)] = 100,
#         ):
#     heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
#     return heroes

# list[Hero] not usable? Says Sequence[Hero]
# @app.get("/heroes/")
# def get_heroes(
#         session: SessionDep, 
#         offset: int = 0, 
#         limit: Annotated[int, Query(le=100)] = 100,
#         ) -> list[Hero]:
#     heroes = session.exec(select(Hero).offset(offset).limit(limit)).all()
#     return heroes
#

@app.get("/db_user/")
def get_db_user(db: Session, user_id: int):
    return db.query(User).filter(User.id == user_id).first()

# Need to figure out how to use these
