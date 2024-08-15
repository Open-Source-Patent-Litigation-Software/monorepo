from flask import Blueprint, jsonify, request, Response, stream_with_context
from .factory import NLPFactory
from utils.auth import Auth0JWTBearerTokenValidator
from authlib.integrations.flask_oauth2 import ResourceProtector
import logging, uuid, threading

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
        response = NLPFactory.getHandler(NLPFactory.RequestType.CITATIONS, data)  # type: ignore

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
# @require_auth("user")
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    try:
        # Get Auth Context
        ctx = require_auth.acquire_token()
        data = request.get_json()

        dynamoInstanceIds = [str(uuid.uuid4()) for _ in range(data["numPatents"])]
        data["dynamoInstanceIds"] = dynamoInstanceIds
        data["user"] = ctx["sub"]  # add the user id (from auth-0) to the data

        def run_nlp_handler(request_type, data):
            nlp_factory = NLPFactory()
            nlp_factory.getHandler(request_type, data)

        searchPopulator = threading.Thread(
            target=run_nlp_handler, args=(NLPFactory.RequestType.SEARCH, data)
        )
        searchPopulator.start()

        # return jsonified response
        response = {"dynamoInstanceIds": dynamoInstanceIds, "user": data["user"]}
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        logger.error(str(e))
        return jsonify({"error": f"An unexpected error occurred: {str(e)}"}), 500
