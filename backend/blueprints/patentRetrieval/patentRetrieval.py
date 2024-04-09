from flask import Blueprint, request, jsonify

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")


@patentRetrieval.route("/patentQuery", methods=["GET"])
def patentRetrievalRoute():
    request.headers.get('search')
    """Route to retrieve patent information."""
    return jsonify({"message": "Patent retrieval route is working!"})
