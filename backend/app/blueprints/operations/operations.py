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

operations = Blueprint("operations", __name__, template_folder="templates")


@operations.route("/addToWaitlist", methods=["POST"])
def addToWaitlist():
    """Add user to waitlist."""
    data = request.get_json()  # Extract Email + Phone Number from JSON
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400

    email = data.get("email")
    phoneNumber = data.get("phoneNumber")
    response = postToList(email, phoneNumber)
    return response  # contains JSON response


@operations.route("/contact", methods=["POST"])
def handleContactQuery():
    """Handle contact query."""
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No Contact Form JSON data provided"}), 400

    firstName = data["firstName"]
    lastName = data["lastName"]
    email = data["email"]
    message = data["message"]
    response = postContactQuery(firstName, lastName, email, message)
    return response


@operations.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400

    response = registerUser(
        data.get("firstName"),
        data.get("lastName"),
        data.get("email"),
        data.get("phone"),
        data.get("password"),
    )

    return response


@operations.route("/signin", methods=["POST"])
def signin():
    print("/signin called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    email = data.get("email")
    password = data.get("password")
    response = signInUser(email, password)
    return response


@operations.route("/signout", methods=["GET"])
def signout():
    session.clear()
    return jsonify({"message": "Successfully signed out"})


@operations.route("/@me", methods=["GET"])
def me():
    print("/@me called")
    response = retrieveUserInfo()
    return response


@operations.route("/createOrganization", methods=["POST"])
def createOrganization():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400

    # Extract data from JSON
    name = data.get("name")
    phone = data.get("phone")
    features = data.get("features")

    print(name, phone, features)
    response = postOrganization(name, phone, features)

    return response
