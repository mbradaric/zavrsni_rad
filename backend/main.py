from fastapi import Depends, FastAPI, HTTPException, Query, Header
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import uuid

from . import crud, models, schemas
from .database import SessionLocal, engine
from .core.security import create_access_token, hash_password, verify_password, get_current_user, get_current_admin_user

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:4200"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# get session id for anonymous cart
def get_session_id(session_id: Optional[str] = Header(None)):
    if not session_id:
        session_id = str(uuid.uuid4())
    return session_id

# users endpoints
@app.post("/users/", response_model=schemas.User)
def create_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email već registriran")
    return crud.create_user(db=db, user=user)

@app.get("/users/", response_model=list[schemas.User])
def read_users(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    users = crud.get_users(db, skip=skip, limit=limit)
    return users

@app.get("/users/{user_id}", response_model=schemas.User)
def read_user(user_id: int, db: Session = Depends(get_db)):
    db_user = crud.get_user(db, user_id=user_id)
    if db_user is None:
        raise HTTPException(status_code=404, detail="Korisnik nije pronađen")
    return db_user

@app.post("/register/", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = crud.get_user_by_email(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email već registriran")
    return crud.create_user(db=db, user=user)

@app.post("/login/", response_model=schemas.LoginResponse)
def login_user(login: schemas.UserLogin, db: Session = Depends(get_db)):
    user = crud.get_user_by_email(db, email=login.email)
    if not user or not verify_password(login.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    # Create JWT token
    access_token = create_access_token(data={"sub": user.email})
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "first_name": user.first_name,
        "last_name": user.last_name,
        "user_id": user.id,
        "is_admin": user.is_admin,
    }

# articles endpoints
@app.post("/articles/", response_model=schemas.Article)
def create_article(
    article: schemas.ArticleCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    return crud.create_article(db=db, article=article)

@app.get("/articles/", response_model=list[schemas.Article])
def read_articles(category_id: int = Query(None), skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    articles = crud.get_articles(db, category_id=category_id, skip=skip, limit=limit)
    return articles

@app.get("/articles/{article_id}", response_model=schemas.Article)
def read_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    return db_article

@app.delete("/articles/{article_id}", response_model=dict)
def delete_article(
    article_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    return crud.remove_article(db, article_id=article_id)

@app.put("/articles/{article_id}", response_model=schemas.Article)
def update_article(
    article_id: int,
    article: schemas.ArticleUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_admin_user)
):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    return crud.update_article(db=db, db_article=db_article, article=article)

@app.get("/articles/search/", response_model=list[schemas.Article])
def search_articles(
    query: str = Query(..., min_length=1),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return crud.search_articles(db, query=query, limit=limit)


# cart endpoints
@app.get("/cart/", response_model=schemas.Cart)
def get_cart(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    return crud.get_cart(db, user_id=current_user.id if current_user else None, session_id=session_id)

@app.post("/cart/add/", response_model=schemas.Cart)
def add_to_cart(
    cart_item: schemas.CartAdd,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    article = crud.get_article(db, article_id=cart_item.article_id)
    if not article:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    
    return crud.add_to_cart(
        db, 
        article_id=cart_item.article_id,
        quantity=cart_item.quantity,
        user_id=current_user.id if current_user else None,
        session_id=session_id
    )

@app.put("/cart/update/", response_model=schemas.Cart)
def update_cart_item(
    cart_update: schemas.CartUpdate,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    return crud.update_cart_item(
        db,
        article_id=cart_update.article_id,
        quantity=cart_update.quantity,
        user_id=current_user.id if current_user else None,
        session_id=session_id
    )

@app.delete("/cart/remove/{article_id}", response_model=schemas.Cart)
def remove_from_cart(
    article_id: int,
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    return crud.remove_from_cart(
        db,
        article_id=article_id,
        user_id=current_user.id if current_user else None,
        session_id=session_id
    )

@app.delete("/cart/clear/", response_model=dict)
def clear_cart(
    db: Session = Depends(get_db),
    session_id: str = Depends(get_session_id),
    current_user: Optional[models.User] = Depends(get_current_user)
):
    crud.clear_cart(
        db,
        user_id=current_user.id if current_user else None,
        session_id=session_id
    )
    return {"message": "Cart cleared successfully"}