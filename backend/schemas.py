from typing import List, Optional
from pydantic import BaseModel, EmailStr

class ArticleBase(BaseModel):
    title: str
    price: float
    img_src: str
    category_id: int
    subcategory_id: int

class ArticleCreate(ArticleBase):
    pass

class ArticleUpdate(ArticleBase):
    title: str | None = None
    price: float | None = None
    img_src: str | None = None
    category_id: int | None = None
    subcategory_id: int | None = None

class Article(ArticleBase):
    id: int
    class Config:
        from_attributes = True

# ---------------- Cart ---------------- #
class CartItem(BaseModel):
    id: int
    title: str
    price: float
    quantity: int
    img_src: str

class CartAdd(BaseModel):
    article_id: int
    quantity: int = 1

class CartUpdate(BaseModel):
    article_id: int
    quantity: int

class CartRemove(BaseModel):
    article_id: int

class Cart(BaseModel):
    user_id: Optional[int] = None
    items: List[CartItem] = []
    total_price: float = 0.0
    total_items: int = 0


# ---------------- Users ---------------- #
class UserBase(BaseModel):
    email: EmailStr
    first_name: str
    last_name: str
    phone_number: str
    address: str
    city: str
    postal_code: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    articles: list[Article] = []

    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: EmailStr
    password: str
