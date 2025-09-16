from typing import Optional
from sqlalchemy import and_
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


def update_article(db: Session, db_article: models.Article, article: schemas.ArticleUpdate):
    db_article.title = article.title
    db_article.price = article.price
    db_article.img_src = article.img_src
    db_article.category_id = article.category_id
    db_article.subcategory_id = article.subcategory_id

    db.commit()
    db.refresh(db_article)
    return db_article


# Cart CRUD

def get_cart(db: Session, user_id: Optional[int] = None, session_id: Optional[str] = None) -> schemas.Cart:
    """Get cart items for a user or session"""
    if user_id:
        cart_items = db.query(models.CartItem).filter(
            models.CartItem.user_id == user_id
        ).all()
    elif session_id:
        cart_items = db.query(models.CartItem).filter(
            models.CartItem.session_id == session_id
        ).all()
    else:
        return schemas.Cart(items=[], total_price=0.0, total_items=0)
    
    items = []
    total_price = 0.0
    total_items = 0
    
    for cart_item in cart_items:
        article = cart_item.article
        item = schemas.CartItem(
            id=article.id,
            title=article.title,
            price=article.price,
            quantity=cart_item.quantity,
            img_src=article.img_src
        )
        items.append(item)
        total_price += article.price * cart_item.quantity
        total_items += cart_item.quantity
    
    return schemas.Cart(
        user_id=user_id,
        items=items,
        total_price=total_price,
        total_items=total_items
    )

def add_to_cart(
    db: Session, 
    article_id: int, 
    quantity: int = 1,
    user_id: Optional[int] = None, 
    session_id: Optional[str] = None
) -> schemas.Cart:
    """Add an article to the cart"""
    # Check if item already exists in cart
    if user_id:
        existing_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.user_id == user_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    elif session_id:
        existing_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.session_id == session_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    else:
        existing_item = None
    
    if existing_item:
        # Update quantity if item exists
        existing_item.quantity += quantity
        db.commit()
        db.refresh(existing_item)
    else:
        # Create new cart item
        db_cart_item = models.CartItem(
            user_id=user_id,
            session_id=session_id,
            article_id=article_id,
            quantity=quantity
        )
        db.add(db_cart_item)
        db.commit()
        db.refresh(db_cart_item)
    
    return get_cart(db, user_id=user_id, session_id=session_id)

def update_cart_item(
    db: Session,
    article_id: int,
    quantity: int,
    user_id: Optional[int] = None,
    session_id: Optional[str] = None
) -> schemas.Cart:
    """Update the quantity of an item in the cart"""
    if user_id:
        cart_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.user_id == user_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    elif session_id:
        cart_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.session_id == session_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    else:
        cart_item = None
    
    if cart_item:
        if quantity <= 0:
            # Remove item if quantity is 0 or less
            db.delete(cart_item)
        else:
            cart_item.quantity = quantity
        db.commit()
    
    return get_cart(db, user_id=user_id, session_id=session_id)

def remove_from_cart(
    db: Session,
    article_id: int,
    user_id: Optional[int] = None,
    session_id: Optional[str] = None
) -> schemas.Cart:
    if user_id:
        cart_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.user_id == user_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    elif session_id:
        cart_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.session_id == session_id,
                models.CartItem.article_id == article_id
            )
        ).first()
    else:
        cart_item = None
    
    if cart_item:
        db.delete(cart_item)
        db.commit()
    
    return get_cart(db, user_id=user_id, session_id=session_id)

def clear_cart(
    db: Session,
    user_id: Optional[int] = None,
    session_id: Optional[str] = None
) -> None:
    """Clear all items from the cart"""
    if user_id:
        db.query(models.CartItem).filter(
            models.CartItem.user_id == user_id
        ).delete()
    elif session_id:
        db.query(models.CartItem).filter(
            models.CartItem.session_id == session_id
        ).delete()
    
    db.commit()

def merge_carts(
    db: Session,
    user_id: int,
    session_id: str
) -> None:
    """Merge anonymous cart with user cart when user logs in"""
    # Get anonymous cart items
    anonymous_items = db.query(models.CartItem).filter(
        models.CartItem.session_id == session_id
    ).all()
    
    for anon_item in anonymous_items:
        # Check if user already has this item
        user_item = db.query(models.CartItem).filter(
            and_(
                models.CartItem.user_id == user_id,
                models.CartItem.article_id == anon_item.article_id
            )
        ).first()
        
        if user_item:
            # Merge quantities
            user_item.quantity += anon_item.quantity
            db.delete(anon_item)
        else:
            # Transfer item to user
            anon_item.user_id = user_id
            anon_item.session_id = None
    
    db.commit()