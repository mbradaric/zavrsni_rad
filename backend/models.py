from sqlalchemy import Column, Integer, String, ForeignKey, Float, Boolean, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)

    first_name = Column(String)
    last_name = Column(String)
    phone_number = Column(String)
    address = Column(String)
    city = Column(String)
    postal_code = Column(String)
    
    cart_items = relationship("CartItem", back_populates="user", cascade="all, delete-orphan")
    

class Category(Base):
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)

    subcategories = relationship("Subcategory", back_populates="category")
    articles = relationship("Article", back_populates="category")

class Subcategory(Base):
    __tablename__ = "subcategories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    category_id = Column(Integer, ForeignKey('categories.id'))

    category = relationship("Category", back_populates="subcategories")
    articles = relationship("Article", back_populates="subcategory")

class Article(Base):
    __tablename__ = "articles"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    price = Column(Float)
    img_src = Column(String)
    category_id = Column(Integer, ForeignKey('categories.id'))
    subcategory_id = Column(Integer, ForeignKey('subcategories.id'))

    category = relationship("Category", back_populates="articles")
    subcategory = relationship("Subcategory", back_populates="articles")
    cart_items = relationship("CartItem", back_populates="article")


class CartItem(Base):
    __tablename__ = "cart_items"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True) 
    article_id = Column(Integer, ForeignKey('articles.id'))
    quantity = Column(Integer, default=1)
    session_id = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now, onupdate=datetime.now)

    user = relationship("User", back_populates="cart_items")
    article = relationship("Article", back_populates="cart_items")