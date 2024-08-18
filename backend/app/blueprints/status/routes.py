from flask import Blueprint, jsonify, request
import logging
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator

status = Blueprint("status", __name__, template_folder="templates")
logger = logging.getLogger("__name__")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://localhost:8000"
)
require_auth.register_token_validator(validator)

@status.route("/<uid>", methods=["GET"])
@require_auth("user")
def patent(uid):
    """Save a patent to the database."""
    # TODO: Fix Data Validation
    ctx = require_auth.acquire_token()
    # Extract the sub (user ID) from the claims
    userID = ctx["sub"]
    # Get JSON Body from HTTP request
    data = request.get_json()
    try:
        saver = DatabaseCallFactory.getHandler(DatabaseCallFactory.RequestType.SAVER)
        user = saver.getOrCreateUser(userID)
        saver.savePatent(user.id, data)
    except Exception as e:
        logger.error(str(e))
        return jsonify({"error": str(e)}), 400
    logger.info(f"Received data: {data}")
    return (
        jsonify({"response": "DATA SAVED"}),
        200,
    )