# tests/test_app.py
import os
import pytest
from flask import Flask
from app import create_app

@pytest.fixture
def app():
    # Set up environment variables for testing
    os.environ["SECRET_KEY"] = "test_secret_key"
    os.environ["FLASK_ENV"] = "development"
    os.environ["FRONTEND_URL"] = "http://localhost:3000"

    app = create_app()
    return app

@pytest.fixture
def client(app):
    return app.test_client()

def test_home_route(client):
    response = client.get('/')
    assert response.status_code == 200
    assert response.data.decode('utf-8') == "It works."

def test_cors_configuration(app):
    # Check if CORS is configured correctly in development mode
    if os.getenv("FLASK_ENV") == "development":
        assert app.after_request_funcs.get(None) is not None
        assert len(app.after_request_funcs[None]) > 0

def test_secret_key(app):
    assert app.secret_key == "test_secret_key"
