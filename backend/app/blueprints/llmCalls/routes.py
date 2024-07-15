from flask import Blueprint, jsonify, request
from .factory import LLMCallFactory
import logging
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator


llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")
logger = logging.getLogger("__name__")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://localhost:8000"
)
require_auth.register_token_validator(validator)


@llmCalls.route("/obtainMetrics", methods=["POST"])
@require_auth("user")
def obtainMetrics():
    """Route to extract metrics from a given text."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.METRICS, data)

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


@llmCalls.route("/extractSpecificPatentMetrics", methods=["POST"])
@require_auth("user")
def extractSpecificPatentMetrics():
    """Route to extract specific metrics from a given patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = LLMCallFactory.getHandler(
            LLMCallFactory.RequestType.PERCENTAGES, data
        )

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


@llmCalls.route("/getCitation", methods=["POST"])
@require_auth("user")
def getCitation():
    """Route to extract highlighted text based on metrics for a given patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.CITATIONS, data)

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


@llmCalls.route("/getSummary", methods=["POST"])
@require_auth("user")
def getSummary():
    """Route to extract the summar of the patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.SUMMARY, data)

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


@llmCalls.route("/getPatent", methods=["POST"])
@require_auth("user")
def bulkSummaries():
    """Route to extract the summar of the patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get the response from the factory
        response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.SUMMARY, data)

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


@llmCalls.route("getBulkSummaries", methods=["POST"])
@require_auth("user")
def getBulkSummaries():
    """Route to extract the summary of the patent."""
    try:
        # get data from JSON
        data = request.get_json()
        # get the response from the factory
        response = LLMCallFactory.getHandler(LLMCallFactory.RequestType.BULK, data)
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
