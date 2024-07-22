from flask import Blueprint, jsonify, request
import logging
from .schema import PatentData
from authlib.integrations.flask_oauth2 import ResourceProtector
from authlib.jose import jwt
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
@require_auth("user")
def patent():
    """Save a patent to the database."""

    # Extract the sub (user ID) from the claims
    ctx = require_auth.acquire_token()
    userID = ctx.get("sub")

    # Get JSON Body from HTTP request
    data = request.get_json()

    try:
        validatedData = PatentData(**data)
        saver = DatabaseCallFactory.getHandler(DatabaseCallFactory.RequestType.SAVER)
        user = saver.getOrCreateUser(userID)
        saver.savePatent(user.id, validatedData)
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    logger.info(f"Received data: {validatedData}")
    return (
        jsonify({"response": "properly worked", "body": validatedData.model_dump()}),
        200,
    )


@saved.route("/fetch_patents", methods=["POST"])
@require_auth("user")
def fetchPatents():
    """Get all saved patents from the database."""
    try:
        ctx = require_auth.acquire_token()
        userID = ctx.get("sub")
        saver = DatabaseCallFactory.getHandler(DatabaseCallFactory.RequestType.SAVER)
        user = saver.getOrCreateUser(userID)
        patents = saver.queryPatents(user.id)
        return jsonify({"patents": patents}), 200
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400


@saved.route("/remove_patent", methods=["POST"])
@require_auth("user")
def removePatent():
    """Get all saved patents from the database."""
    data = request.get_json()
    patentID = data.get("patent_id")
    try:
        ctx = require_auth.acquire_token()
        userID = ctx.get("sub")
        saver = DatabaseCallFactory.getHandler(DatabaseCallFactory.RequestType.SAVER)
        user = saver.getOrCreateUser(userID)
        saver.deletePatent(user.id, patentID)
        return jsonify({"Message": "Patent Removed", "patentID": patentID}), 200
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400


@saved.route("/get_saved_patent", methods=["POST"])
def getSavedPatent():
    """Get all saved patents from the database."""
    data = request.get_json()
    patentID = data.get("patent_id")
    try:
        fetcher = DatabaseCallFactory.getHandler(
            DatabaseCallFactory.RequestType.FETCH_PATENT
        )
        patent = fetcher.fetchPatent(patentID)
        if patent:
            return jsonify({"patent": patent}), 200
        else:
            return jsonify({"error": "Patent not found"}), 404
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
