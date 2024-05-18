from flask import Blueprint, jsonify, request

operations = Blueprint("operations", __name__, template_folder="templates")
from database.posts import postToList, postContactQuery


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
