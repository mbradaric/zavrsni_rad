from pydantic import BaseModel, EmailStr

class ArticleBase(BaseModel):
    title: str
    price: float
    img_src: str
    category_id: int
    subcategory_id: int

class ArticleCreate(ArticleBase):
    pass

class Article(ArticleBase):
    id: int

    class Config:
        from_attributes = True

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