# tests/conftest.py
import pytest
from app import create_app
from utils.auth import Auth0JWTBearerTokenValidator
from authlib.integrations.flask_oauth2 import ResourceProtector

@pytest.fixture
def app():
    app = create_app()
    require_auth = ResourceProtector()
    validator = Auth0JWTBearerTokenValidator(
        "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://dulany-test"
    )
    require_auth.register_token_validator(validator)
    return app

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def runner(app):
    return app.test_cli_runner()

@pytest.fixture
def auth_headers():
    return {
        'authorization': 'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InZoaEhpdFRfbC1GOFQ0b01MbUNUMyJ9.eyJpc3MiOiJodHRwczovL2Rldi1naXYzZHJ3ZDV6ZDFjcXNiLnVzLmF1dGgwLmNvbS8iLCJzdWIiOiJQNXZsVGJQSHprRGJiakZsSllRaHRKeW9VU3JkR1FEOEBjbGllbnRzIiwiYXVkIjoiaHR0cDovL2R1bGFueS10ZXN0IiwiaWF0IjoxNzIwNzI5NzUzLCJleHAiOjE3MjA4MTYxNTMsImd0eSI6ImNsaWVudC1jcmVkZW50aWFscyIsImF6cCI6IlA1dmxUYlBIemtEYmJqRmxKWVFodEp5b1VTcmRHUUQ4In0.JHIUC-svov0Ip6WYuvt1-hXB1RYymUUZnMi6t3Pjemu2N4iVfnj8xCcE2AnvFken8V_uK6wOaCfnKYonUS7WPTjVb4oBs8C2lIGF7UIxp0x4ev6iTvJnybP_IBFOV2WJGYMdxTHe-3qu59S6K6mM6NV6yiKR5OLZtx-7FQrtThnFmr4MB-RNa4NtgWNjklmGdPbbFFWfvDNU7C_kHJuXKmCDzI959LE49L3W95qeqN0b6y2m6y9uotNfDNTwOE8eM2K3zq9ZQKuV0upNFoEoxxnVymxs0m4WeemoLJYkvsMhK_rxCSEPhAkgZ5e3-NWfIgH50rAxfGu1qR9acdU2_g'
    }