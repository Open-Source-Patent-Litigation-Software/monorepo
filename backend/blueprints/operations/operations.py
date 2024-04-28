from flask import Blueprint, jsonify, request

operations = Blueprint("operations", __name__, template_folder="templates")
from database.posts import postToList


@operations.route("/addToWaitlist", methods=["POST"])
def addToWaitlist():
    """Add user to waitlist."""

    data = request.get_json()  # Extract Email + Phone Number from JSON

    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    
    email = data.get('email')
    phoneNumber = data.get('phoneNumber')
    message = postToList(email, phoneNumber)

    return message  # contains JSON response
