from fastapi import Depends, FastAPI, HTTPException, Query
from sqlalchemy.orm import Session
from fastapi.middleware.cors import CORSMiddleware

from . import crud, models, schemas
from .database import SessionLocal, engine
from .core.security import create_access_token, hash_password, verify_password

models.Base.metadata.create_all(bind=engine) # create the tables in the database

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

@app.post("/login/")
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
    }

# articles endpoints
@app.post("/articles/", response_model=schemas.Article)
def create_article(article: schemas.ArticleCreate, db: Session = Depends(get_db)):
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
def delete_article(article_id: int, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    return crud.remove_article(db, article_id=article_id)

@app.put("/articles/{article_id}", response_model=schemas.Article)
def update_article(article_id: int, article: schemas.ArticleUpdate, db: Session = Depends(get_db)):
    db_article = crud.get_article(db, article_id=article_id)
    if db_article is None:
        raise HTTPException(status_code=404, detail="Artikl nije pronađen")
    return crud.update_article(db=db, db_article=db_article, article=article)
