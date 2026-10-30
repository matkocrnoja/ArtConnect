from fastapi import Depends, FastAPI
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.database import get_db
from app.middleware import setup_cors, setup_session
from app.routers import art, auth

app = FastAPI(title="ArtConnect API")
setup_cors(app)
setup_session(app)
app.include_router(auth.router)
app.include_router(art.router)


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/health/db")
def health_db(db: Session = Depends(get_db)):
    db.execute(text("SELECT 1"))
    return {"db": "ok"}
