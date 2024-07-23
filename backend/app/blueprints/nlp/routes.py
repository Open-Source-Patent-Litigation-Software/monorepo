from flask import Blueprint, jsonify, request, Response, stream_with_context
from .factory import NLPFactory
import logging
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator
import json

nlp = Blueprint("nlp", __name__, template_folder="templates")
logger = logging.getLogger("__name__")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://localhost:8000"
)
require_auth.register_token_validator(validator)

@nlp.route("/getCitations", methods=["POST"])
@require_auth("user")
def getCitations():
    """Route to extract highlighted text based on metrics for a given patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = NLPFactory.getHandler(NLPFactory.RequestType.CITATIONS, data)

        # return jsonified response
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        logger.error(str(e))
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500

@nlp.route("/searchPatents", methods=["POST"])
@require_auth("user")
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = NLPFactory.getHandler(NLPFactory.RequestType.SEARCH, data)

        # return jsonified response
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        logger.error(str(e))
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500