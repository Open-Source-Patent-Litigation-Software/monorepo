from flask import Blueprint, jsonify, request, session
import bcrypt

operations = Blueprint("operations", __name__, template_folder="templates")
from database.posts import postToList, postContactQuery, registerUser, signInUser

# USE session['key'] TO EXTRACT REDIS CONNECTION


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
    """Add user to waitlist."""
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No Contact Form JSON data provided"}), 400

    firstName = data["firstName"]
    lastName = data["lastName"]
    email = data["email"]
    message = data["message"]

    response = postContactQuery(firstName, lastName, email, message)
    print(response)
    return response


@operations.route("/signup", methods=["POST"])
def signup():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    password = data.get("password")
    hashed_password = bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode(
        "utf-8"
    )
    # def registerUser(firstName: str, lastName: str, email: str, phone: str, password: str):
    response = registerUser(
        data.get("firstName"),
        data.get("lastName"),
        data.get("email"),
        data.get("phone"),
        hashed_password,
    )
    # Maybe return loggin session???
    return response


@operations.route("/signin", methods=["POST"])
def signin():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    email = data.get("email")
    password = data.get("password")
    print(email, password)
    response = signInUser(email, password)
    return response
