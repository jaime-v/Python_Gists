from fastapi import FastAPI, status, Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
from pydantic import BaseModel

class Item(BaseModel):
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

app = FastAPI()

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
async def create_user(user: UserIn):
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
async def create_item(item: Item):
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
async def update_item(item_id: int, item: Item):
    return {"item_id": item_id, "item": item.model_dump()}

@app.delete("/items/${item_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_item(item_id: int):
    print(item_id)
    return None
