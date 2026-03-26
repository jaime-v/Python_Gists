# main.py
"""
Driver for the code
"""

from fastapi import FastAPI, status, Depends, HTTPException, Query, status
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional, Annotated

# Docs suggestion for security
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pwdlib import PasswordHash
from jwt.exceptions import InvalidTokenError
from datetime import datetime, timedelta, timezone
import jwt

# Devsheets suggestion fro SQL
from sqlalchemy.orm import Session

# import other files
from backend.app.schemas import (
    ItemIn,
    ItemOut,
    UserIn,
    UserOut,
    TestUser,
    TestUserInDB,
    TestToken,
    TestTokenData,
)
from backend.app.db import get_db, User, Item

# Secret key generated with `openssl rand -hex 32`
SECRET_KEY = "244af04456dee9675f1fef2d21e763fefda16e934d6f88023edcb3ea2814325f"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRES_MINUTES = 30

# App starts here
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
password_hash = PasswordHash.recommended()
DUMMY_HASH = password_hash.hash("dummypassword")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def fake_hash_password(password: str):
    return "fakehashed" + password


def get_password_hash(password: str):
    return password_hash.hash(password)


def verify_password(plain_password: str, hashed_password: str):
    return password_hash.verify(plain_password, hashed_password)


# Just a root get
@app.get("/")
async def get_root():
    return {"Root": "Root"}


# Fake database for learning security stuff

fake_users_db = {
    "johndoe": {
        "username": "johndoe",
        "full_name": "John Doe",
        "email": "johndoe@example.com",
        "hashed_password": "$argon2id$v=19$m=65536,t=3,p=4$wagCPXjifgvUFBzq4hqe3w$CYaIb8sB+wtD+Vu/P4uod1+Qof8h+1g7bbDlBID48Rc",
        "disabled": False,
    },
    "alice": {
        "username": "alice",
        "full_name": "Alice Wonderson",
        "email": "alice@example.com",
        "hashed_password": "fakehashedsecret2",
        "disabled": True,
    },
}


# Security work routes


@app.get("/items/")
async def get_items(token: Annotated[str, Depends(oauth2_scheme)]):
    return {"token": token}


# def fake_decode_token(token):
#     return TestUser(
#             username=token + "fakedecoded",
#             email="john@example.com",
#             full_name="John Doe"
#             )

# async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
#     user = fake_decode_token(token)
#     return user


def get_test_user(db, username: str):
    if username in db:
        user_dict = db[username]
        return TestUserInDB(**user_dict)
    # What the heck is ** used for


def fake_decode_token(token):
    user = get_test_user(fake_users_db, token)
    return user


def authenticate_user(fake_db, username: str, password: str):
    user = get_test_user(fake_db, username)
    if not user:
        verify_password(password, DUMMY_HASH)
        return False
    if not verify_password(password, user.hashed_password):
        return False
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TestTokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception
    user = get_test_user(fake_users_db, username=token_data.username)
    if user is None:
        raise credentials_exception
    return user

    # Old
    # user = fake_decode_token(token)
    # if not user:
    #     raise HTTPException(
    #             status_code=status.HTTP_401_UNAUTHORIZED,
    #             detail="Not authenticated",
    #             headers={"WWW-Authenticate": "Bearer"}
    #             )
    # return user


async def get_current_active_user(
    current_user: Annotated[TestUser, Depends(get_current_user)],
):
    if current_user.disabled:
        raise HTTPException(status_code=400, detail="Inactive User")
    return current_user


@app.post("/token/")
async def login(
    form_data: Annotated[OAuth2PasswordRequestForm, Depends()],
) -> TestToken:
    user = authenticate_user(fake_users_db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRES_MINUTES)
    access_token = create_access_token(
        data={"sub": user.username}, expires_delta=access_token_expires
    )
    return TestToken(access_token=access_token, token_type="Bearer")

    # Old
    # user_dict = fake_users_db.get(form_data.username)
    # if not user_dict:
    #     raise HTTPException(
    #             status_code=400,
    #             detail="Incorrect username or password"
    #             )
    # user = TestUserInDB(**user_dict)
    # hashed_password = fake_hash_password(form_data.password)
    # if not hashed_password == user.hashed_password:
    #     raise HTTPException(
    #             status_code=400,
    #             detail="Incorrect username or password"
    #             )
    # return {"access_token": user.username, "token_type": "bearer"}


@app.get("/users/me/")
async def get_users_me(
    current_user: Annotated[TestUser, Depends(get_current_active_user)],
) -> TestUser:
    return current_user


@app.get("/users/me/items/")
async def get_users_me_items(
    current_user: Annotated[TestUser, Depends(get_current_active_user)],
):
    return [{"item_id": "Foo", "owner": current_user.username}]


# Get user from database
@app.get("/db_user/{user_id}/", response_model=UserOut)
async def get_db_user(user_id: int, db: Session = Depends(get_db)):
    # I think this is a query to the User table (class?) filters by user id and
    # then gets the first row
    # Then it returns that row?
    return db.query(User).filter(User.id == user_id).first()


# Get users from database
@app.get("/db_user/")
async def get_all_db_users(db: Session = Depends(get_db)):
    # I think this is a query to the User table (class?) filters by user id and
    # then gets the first row
    # Then it returns that row?
    return db.query(User).all()


@app.post("/db_user/", response_model=UserOut)
async def create_db_user(user: UserIn, db: Session = Depends(get_db)):
    # UserIn has username, email, password
    # hashed = hash_password(user.password)

    # For now just send plain-text
    hashed = user.password
    db_user = User(username=user.username, email=user.email, hashed_password=hashed)
    # Add and commit are like staging and committing changes
    db.add(db_user)
    db.commit()
    # Refresh will get an up-to-date version of the object from database
    db.refresh(db_user)
    # Return it right after
    return db_user


@app.put("/db_user/{user_id}/", response_model=UserOut)
async def update_db_user(
    user_id: int, updated_user: UserIn, db: Session = Depends(get_db)
):
    user_to_update = db.query(User).filter(User.id == user_id).first()
    user_to_update = updated_user
    db.commit()
    db.refresh(user_to_update)
    return user_to_update


@app.delete(
    "/db_user/{user_id}/", response_model=UserOut, status_code=status.HTTP_201_CREATED
)
async def delete_db_user(user_id: int, db: Session = Depends(get_db)):
    user_to_delete = db.query(User).filter(User.id == user_id).first()
    db.delete(user_to_delete)
    db.commit()
    return user_to_delete
