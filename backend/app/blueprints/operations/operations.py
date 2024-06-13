from flask import Blueprint, jsonify, request, session
from database.posts import (
    postToList,
    postContactQuery,
    registerUser,
    signInUser,
    postOrganization,
    retrieveUserInfo
)
from flask import jsonify, session
import logging
from utils.validator import validate_json

operations = Blueprint("operations", __name__, template_folder="templates")

logger =  logging.getLogger("__name__")


@operations.route("/addToWaitlist", methods=["POST"])
def addToWaitlist():
    """Add user to waitlist."""
    data = request.get_json()  # Extract Email + Phone Number from JSON
    if data is None:
        logger.error("No JSON data provided to addToWaitlist")
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredField = {
        "email": str,
        "phoneNumber": str,
    }

    valid, errorMessage = validate_json(data, requiredField)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400
    
    email = data.get("email")
    phoneNumber = data.get("phoneNumber")
    
    # TODO: probably want to add some way to identify them without using their email?
    logger.info("user was added to waitlist")

    response = postToList(email, phoneNumber)
    return response  # contains JSON response


@operations.route("/contact", methods=["POST"])
def handleContactQuery():
    """Handle contact query."""
    data = request.get_json()
    if data is None:
        logger.error("No Contact Form JSON data provided")
        return jsonify({"error": "No Contact Form JSON data provided"}), 400

    firstName = data["firstName"]
    lastName = data["lastName"]
    email = data["email"]
    message = data["message"]

    requiredFields = {
        "firstName": str,
        "lastName": str,
        "email": str,
        "message": str
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400
    
    logger.info("Contact query made")
    
    response = postContactQuery(firstName, lastName, email, message)
    return response


@operations.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredFields = {
        "firstName": str,
        "lastName": str,
        "email": str,
        "phone": str,
        "password": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400
    
    firstName = data["firstName"]
    lastName = data["lastName"]
    email = data["email"]
    phone = data["phone"]
    password = data["password"]

    logger.info("user signing up")

    response = registerUser(
        firstName,
        lastName,
        email,
        phone,
        password,
    )

    return response


@operations.route("/signin", methods=["POST"])
def signin():
    print("/signin called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredFields = {
        "email": str,
        "password": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400

    email = data.get("email")
    password = data.get("password")

    logger.info("user signing in")

    response = signInUser(email, password)
    return response


@operations.route("/signout", methods=["GET"])
def signout():
    session.clear()
    logger.info("user signed out")
    return jsonify({"message": "Successfully signed out"})


@operations.route("/@me", methods=["GET"])
def me():
    logger.info("@me called")
    response = retrieveUserInfo()
    return response


@operations.route("/createOrganization", methods=["POST"])
def createOrganization():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredFields = {
        "name": str,
        "phone": str,
        "features": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400

    # Extract data from JSON
    name = data.get("name")
    phone = data.get("phone")
    features = data.get("features")

    logger.info("creating organization")
    response = postOrganization(name, phone, features)

    return response
