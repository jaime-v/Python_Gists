"""
test.py

Really just a bunch of stuff that I don't want to delete in case it might
be useful later

I swear I'm never going to use this
"""

# Attempt for password hashing
# from passlib.context import CryptContext

# Password hashing stuff
# pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# def hash_password(password: str):
#     return pwd_context.hash(password)

# items = []

# FastAPI Docs suggestion for SQL
# from sqlmodel import Field, Session, SQLModel, create_engine, select
# Docs Suggestion for SQL
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

# Docs outdated?
# @app.on_event("startup")
# def on_startup():
#     create_db_and_tables()


"""
---Bunch of testing patterns---
-- Root
@app.get("/")
async def root():
    return {"message": "Hello World!"}

-- Auth thing
@app.get("/protected/")
async def protected(token: str = Depends(oauth2_scheme)):
    return {"token": token}

-- Get URL params
@app.get("/users/{username}")
async def get_user(username: str):
    return {"username": username}

-- Post with specific response model
@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn, db: Session = Depends(get_db)):
    db_user = User(email=user.email)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return user

-- Query string
@app.get("/search/")
async def search(q: Optional[str] = None):
    return {"query": q}

# @app.get("/items/")
# async def get_items(skip: int = 0, limit: int = 10):
#     return {"skip": skip, "limit": limit}
# Limit can be used to limit the amount of information, can also use | None or
# Optional[int] to make it optional

-- Common params stuff
async def common_params(q: str = "Supposedly None", skip: int = 0):
    return{"q": q, "skip": skip}
@app.get("/commons/")
async def get_commons(commons: dict = Depends(common_params)):
    return commons

-- Get items (in memory storage)
@app.get("/items/")
async def get_items():
    return items

-- Create item
@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: ItemIn):
    items.append(item)
    return item

-- Get specific item
@app.get("/items/{item_id}")
async def get_item(item_id: int):
    print(type(items[0]))
    items_by_id = {item.id : item for item in items}
    item = items_by_id.get(item_id)
    if item is None:
        raise HTTPException(status_code=404, detail="Item not found")
    return item
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

-- Update item
@app.put("/items/{item_id}")
async def update_item(item_id: int, item: ItemIn):
    return {"item_id": item_id, "item": item.model_dump()}

-- Delete item (doesn't actually delete though lol)
@app.delete("/items/${item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    print(item_id)
    return None
"""
# Some stuff from FastAPI docs
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


# Security things from fastapi docs
# @app.get("/items/")
# async def get_items(token: Annotated[str, Depends(oauth2_scheme)]):
#     return {"token": token}
#
#
# # def fake_decode_token(token):
# #     return TestUser(
# #             username=token + "fakedecoded",
# #             email="john@example.com",
# #             full_name="John Doe"
# #             )
#
# # async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
# #     user = fake_decode_token(token)
# #     return user
#
#
# def get_test_user(db, username: str):
#     if username in db:
#         user_dict = db[username]
#         return TestUserInDB(**user_dict)
#     # What the heck is ** used for
#
#
# def fake_decode_token(token):
#     user = get_test_user(fake_users_db, token)
#     return user
#
#
# def authenticate_user(fake_db, username: str, password: str):
#     user = get_test_user(fake_db, username)
#     if not user:
#         verify_password(password, DUMMY_HASH)
#         return False
#     if not verify_password(password, user.hashed_password):
#         return False
#     return user
#
#
# # Old version I got from fastapi docs
# # def create_access_token(data: dict, expires_delta: timedelta | None = None):
# #     to_encode = data.copy()
# #     if expires_delta:
# #         expire = datetime.now(timezone.utc) + expires_delta
# #     else:
# #         expire = datetime.now(timezone.utc) + timedelta(minutes=15)
# #     to_encode.update({"exp": expire})
# #     encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
# #     return encoded_jwt
#
#
# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     credentials_exception = HTTPException(
#         status_code=status.HTTP_401_UNAUTHORIZED,
#         detail="Could not validate credentials",
#         headers={"WWW-Authenticate": "Bearer"},
#     )
#     try:
#         payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
#         username = payload.get("sub")
#         if username is None:
#             raise credentials_exception
#         token_data = TestTokenData(username=username)
#     except InvalidTokenError:
#         raise credentials_exception
#     user = get_test_user(fake_users_db, username=token_data.username)
#     if user is None:
#         raise credentials_exception
#     return user
#
#     # Old
#     # user = fake_decode_token(token)
#     # if not user:
#     #     raise HTTPException(
#     #             status_code=status.HTTP_401_UNAUTHORIZED,
#     #             detail="Not authenticated",
#     #             headers={"WWW-Authenticate": "Bearer"}
#     #             )
#     # return user
#
#
# async def get_current_active_user(
#     current_user: Annotated[TestUser, Depends(get_current_user)],
# ):
#     if current_user.disabled:
#         raise HTTPException(status_code=400, detail="Inactive User")
#     return current_user
#
#
# @app.post("/token/")
# async def login(
#     form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
# ) -> TestToken:
#     user = authenticate_user(fake_users_db, form_data.username, form_data.password)
#     if not user:
#         raise HTTPException(
#             status_code=status.HTTP_401_UNAUTHORIZED,
#             detail="Incorrect username or password",
#             headers={"WWW-Authenticate": "Bearer"},
#         )
#     access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
#     access_token = create_access_token(
#         data={"sub": user.username}, expires_delta=access_token_expires
#     )
#     return TestToken(access_token=access_token, token_type="Bearer")
#
#     # Old
#     # user_dict = fake_users_db.get(form_data.username)
#     # if not user_dict:
#     #     raise HTTPException(
#     #             status_code=400,
#     #             detail="Incorrect username or password"
#     #             )
#     # user = TestUserInDB(**user_dict)
#     # hashed_password = fake_hash_password(form_data.password)
#     # if not hashed_password == user.hashed_password:
#     #     raise HTTPException(
#     #             status_code=400,
#     #             detail="Incorrect username or password"
#     #             )
#     # return {"access_token": user.username, "token_type": "bearer"}
#
#
# @app.get("/users/me/")
# async def get_users_me(
#     current_user: Annotated[TestUser, Depends(get_current_active_user)],
# ) -> TestUser:
#     return current_user
#
#
# @app.get("/users/me/items/")
# async def get_users_me_items(
#     current_user: Annotated[TestUser, Depends(get_current_active_user)],
# ):
#     return [{"item_id": "Foo", "owner": current_user.username}]
#
#
#
# # Docs suggestion for security
# from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
# from pwdlib import PasswordHash
# from jwt.exceptions import InvalidTokenError
# from datetime import datetime, timedelta, timezone
# import jwt
#
#
#
# # import other files
# from app.schemas import (
#     TestUser,
#     TestUserInDB,
#     TestToken,
#     TestTokenData,
# )
#
#
#
# # Fake database for learning security stuff
#
# fake_users_db = {
#     "johndoe": {
#         "username": "johndoe",
#         "full_name": "John Doe",
#         "email": "johndoe@example.com",
#         "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
#         "disabled": False,
#     },
#     "alice": {
#         "username": "alice",
#         "full_name": "Alice Wonderson",
#         "email": "alice@example.com",
#         "hashed_password": "fakehashedsecret2",
#         "disabled": True,
#     },
# }
#
# Old DB config file stuff
# from sqlalchemy import create_engine
# from sqlalchemy.ext.declarative import declarative_base
# from sqlalchemy.orm import sessionmaker
# import os
# from dotenv import load_dotenv
# Devsheets Suggestion
# DATABASE_URL = "sqlite.///./app.db"
# load_dotenv()

# Good practice to add a fallback database, but I don't have that currently
# DATABASE_URL = os.getenv(
#     "DATABASE_URL", "postgresql://postgres:postgres@localhost/gists"
# )


# Engine is connection configuration
# engine = create_engine(DATABASE_URL)

# SessionLocal is a sessionmaker, is creates sessions
# Sessions are actual connections to the database
# SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Base is registry of all the tables
# Base = declarative_base()

# Open a session, use it, then close it
# def get_db():
#     db = SessionLocal()
#     try:
#         yield db
#     finally:
#         db.close()

# Create tables if they don't exist
# def init_db():
#     Base.metadata.create_all(bind=engine)


# More security stuff that was in main
# Secret key generated with `openssl rand -hex 32`
# SECRET_KEY = os.getenv(
#     "SECRET_KEY", "244af04456dee9675f1fef2d21e763fefda16e934d6f88023edcb3ea2814325f"
# )
# ALGORITHM = "HS256"
# ACCESS_TOKEN_EXPIRES_MINUTES = 30


# Testing for security purposes
# class TestUser(BaseModel):
#     username: str
#     email: str | None = None
#     full_name: str | None = None
#     disabled: bool | None = None
#
#
# class TestUserInDB(TestUser):
#     hashed_password: str
#
#
# class TestToken(BaseModel):
#     access_token: str
#     token_type: str
#
#
# class TestTokenData(BaseModel):
#     # This was in the docs, but it keeps giving me error?
#     # username: str | None = None
#     username: str


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
