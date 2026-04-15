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
