from flask import Blueprint, jsonify, request
from .schema import PatentData
import logging

saved = Blueprint("saved", __name__, template_folder="templates")
logger = logging.getLogger("__name__")


@saved.route("/patent", methods=["POST"])
def patent():
    # get data from JSON
    data = request.get_json()
    try:
        validatedData = PatentData(**data)
        print(validatedData)
    except Exception as e:
        return jsonify({"error": str(e)}), 400
    return jsonify({"response": "properly worked"}), 200


@saved.route("/getPatent", methods=["POST"])
def getPatent():
    return jsonify({"error": "not implemented"}), 400
