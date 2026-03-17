from fastapi import FastAPI, status
from typing import Optional
from pydantic import BaseModel

class Item(BaseModel):
    name: str
    price: float
    is_offer: Optional[bool] = None

class UserIn(BaseModel):
    username: str
    email: str
    password: str

class UserOut(BaseModel):
    username: str
    email: str

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World!"}

@app.get("/users/{username}")
async def get_user(username: str):
    return {"username": username}

@app.post("/users/", response_model=UserOut)
async def create_user(user: UserIn):
    return user

@app.get("/search/")
async def search(q: Optional[str] = None):
    return {"query": q}

@app.get("/items/")
async def get_items(skip: int = 0, limit: int = 10):
    return {"skip": skip, "limit": limit}

@app.post("/items/", status_code=status.HTTP_201_CREATED)
async def create_item(item: Item):
    return item

@app.get("/items/{item_id}")
async def get_item(item_id: int):
    return {"item_id": item_id}

@app.put("/items/{item_id}")
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "item": item.model_dump()}

@app.delete("/items/${item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    print(item_id)
    return None
