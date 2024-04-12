from flask import Blueprint, request, jsonify
from settings import PQ_AI_KEY


patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")


@patentRetrieval.route("/makeQuery", methods=["GET"])
def patentRetrievalRoute():
    """Route to retrieve patent information."""
    searchRequest = request.args.get("search")
    return jsonify({"message": "why", "searchQuery": searchRequest})
