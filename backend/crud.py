from sqlalchemy.orm import Session
from . import models, schemas
import bcrypt

# User CRUD
def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def get_users(db: Session, skip: int = 0, limit: int = 100):
    return db.query(models.User).offset(skip).limit(limit).all()

def create_user(db: Session, user: schemas.UserCreate):
    hashed_password = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    db_user = models.User(
        email=user.email,
        hashed_password=hashed_password.decode('utf-8'),
        first_name=user.first_name,
        last_name=user.last_name,
        phone_number=user.phone_number,
        address=user.address,
        city=user.city,
        postal_code=user.postal_code,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return bcrypt.checkpw(plain_password.encode('utf-8'), hashed_password.encode('utf-8'))

# Article CRUD
def get_article(db: Session, article_id: int):
    return db.query(models.Article).filter(models.Article.id == article_id).first()

def get_articles(db: Session, category_id: int = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Article)
    
    if category_id is not None:
        query = query.filter(models.Article.category_id == category_id)
    
    return query.offset(skip).limit(limit).all()

def create_article(db: Session, article: schemas.ArticleCreate):
    db_article = models.Article(
        title=article.title,
        price=article.price,
        img_src=article.img_src,
        category_id=article.category_id,
        subcategory_id=article.subcategory_id
    )
    db.add(db_article)
    db.commit()
    db.refresh(db_article)
    return db_article

def remove_article(db: Session, article_id: int):
    db.query(models.Article).filter(models.Article.id == article_id).delete()
    db.commit()
    return {"message": "Artikl uspješno izbrisan"}