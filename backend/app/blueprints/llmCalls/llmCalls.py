from flask import Blueprint, jsonify, request
import json
from langchain_openai import OpenAI
from app.settings import OPEN_AI_KEY
from utils.metrics import extractTheMetrics, extractSpecificPercentages
from utils.citations import extractCitations, extractCitaionsSingleMetric

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")


@llmCalls.route("/obtainMetrics", methods=["POST"])
def obtainMetrics():
    """Route to extract metrics from a given text."""
    print("/obtainMetrics - called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    query = data.get("query")
    metrics = extractTheMetrics(searchQuery=query, model="gpt-3.5-turbo-0125")[
        "functions"
    ]

    returnObject = {}
    for index in range(len(metrics)):
        returnObject[f"metric{index+1}"] = metrics[index]

    ### IMPLEMENT DATABASE CACHING OF QUERIES HERE IN THE FUTURE ###

    return jsonify(returnObject), 200


@llmCalls.route("/extractSpecificPatentMetrics", methods=["POST"])
def extractSpecificPatentMetrics():
    """Route to extract specific metrics from a given patent."""
    print("/extractSpecificPatentMetrics - called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400

    response = extractSpecificPercentages(
        search=data.get("search"),
        user=data.get("user"),
        patentURL=data.get("patentURL"),
        metrics=data.get("metrics_str"),
    )
    return response


# @llmCalls.route("/getCitations", methods=["POST"])
# def getCitations():
#     """Route to extract highlighted text based on metrics for a given patent."""
#     print("/getCitations - called")
#     data = request.get_json()
#     if data is None:
#         return jsonify({"error": "No JSON data provided"}), 400

#     response = extractCitations(
#         user=data.get("user"),
#         patentURL=data.get("patentURL"),
#         metrics=data.get("metrics_str"),
#     )
#     return response


@llmCalls.route("/getCitation", methods=["POST"])
def getCitation():
    """Route to extract highlighted text based on metrics for a given patent."""
    print("/getCitation - called")
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400

    response = extractCitaionsSingleMetric(
        user=data.get("user"),
        patentURL=data.get("patentURL"),
        metric=data.get("metric_:str"),
    )
    return response
