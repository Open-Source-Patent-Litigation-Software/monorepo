from flask import Blueprint, request, jsonify
import requests
from settings import PQ_AI_KEY


patentRetrieval = Blueprint("operations", __name__, template_folder="templates")

@patentRetrieval.route("/addToWaitlist", methods=["POST"])
def addToWaitlist():
    """Add user to waitlist."""
    return jsonify({"message": "Successfully added to waitlist."})