from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from app.config import get_settings


def setup_cors(app: FastAPI):
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[get_settings().frontend_url],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )


def setup_session(app: FastAPI):
    # Služi samo za state i nonce tijekom odlaska na Google, a prava sesija je kolačić "sesija".
    settings = get_settings()
    app.add_middleware(
        SessionMiddleware,
        secret_key=settings.secret_key.get_secret_value(),
        session_cookie="oauth_state",
        max_age=10 * 60,
        same_site="lax",
        https_only=settings.cookie_secure,
    )
