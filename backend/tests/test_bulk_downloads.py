# test_bulk_downloads.py
import os
import pytest
from flask import Flask
from app import create_app
from app.blueprints.llmCalls.factory import LLMCallFactory
import logging
import sys


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

def test_bulk_summaries_call():
    mock_data = {"patent_ids": ["US20220340893A1", "US11872287B2", "US10729277B2"]}

    response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.BULK, mock_data)
    summaries = response["summaries"]
    # Expected keys in the output
    expected_keys = {"patent", "title", "filing_date", "summary"}

    for item in summaries:
        assert isinstance(
            item, dict
        ), "Each item in the response should be a dictionary"
        assert expected_keys == set(
            item.keys()
        ), "Each item should contain the expected keys"


if __name__ == "__main__":
    logging.basicConfig(stream=sys.stderr)
    logging.getLogger("Test").setLevel(logging.DEBUG)
    pytest.main()
