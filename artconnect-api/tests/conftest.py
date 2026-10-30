import os

# Mora biti prije uvoza aplikacije: testovi nikad ne koriste prave Google podatke iz .env.
os.environ.update(
    GOOGLE_CLIENT_ID="testni-klijent",
    GOOGLE_CLIENT_SECRET="testna-tajna",
    GOOGLE_REDIRECT_URI="http://testserver/auth/google/callback",
    FRONTEND_URL="http://frontend.test",
    SECRET_KEY="testni-kljuc-koji-ima-dovoljno-znakova",
    COOKIE_SECURE="false",
)

import pytest
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def client():
    return TestClient(app)
