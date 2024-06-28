from flask import Blueprint, jsonify, request
import logging
from .schema import PatentData
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator
from pydantic import BaseModel, Field, Json
from database.factory import DatabaseCallFactory

saved = Blueprint("saved", __name__, template_folder="templates")
logger = logging.getLogger("__name__")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://localhost:8000"
)
require_auth.register_token_validator(validator)


@saved.route("/patent", methods=["POST"])
# @require_auth("user")
def patent():
    # get data from JSON
    data = request.get_json()

    try:
        validatedData = PatentData(**data)
        saver = DatabaseCallFactory.getHandler(DatabaseCallFactory.RequestType.SAVER)
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    logger.info(f"Received data: {validatedData}")
    return (
        jsonify({"response": "properly worked", "body": validatedData.model_dump()}),
        200,
    )


@saved.route("/getPatent", methods=["POST"])
def getPatent():
    return jsonify({"error": "not implemented"}), 400
