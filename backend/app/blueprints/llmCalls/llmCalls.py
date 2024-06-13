from flask import Blueprint, jsonify, request
import json
from langchain_openai import OpenAI
from app.settings import OPEN_AI_KEY
from utils.metrics import extractTheMetrics, extractSpecificPercentages
from utils.citations import extractCitaionsSingleMetric
from utils.validator import validate_json
import logging

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")

logger =  logging.getLogger("__name__")

@llmCalls.route("/obtainMetrics", methods=["POST"])
def obtainMetrics():
    """Route to extract metrics from a given text."""
    data = request.get_json()
    if data is None:
        logger.error("obtainMetrics was called with no JSON data")
        return jsonify({"error": "No JSON data provided"}), 400

    query = data.get("query")

    requiredFields = {
        "query": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400
    
    logger.info("metrics were requested to be obtained from {query} query.".format(query=query))
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
    data = request.get_json()
    if data is None:
        logger.error("extractSpecificPatentMetrics was called with no JSON data")
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredFields = {
        "search": str,
        "user": str,
        "url": str,
        "metrics": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400

    # get data from json
    search = data.get("search")
    user = data.get("user")
    url = data.get("patentURL")
    metrics = data.get("metrics_str")

    # log interaction
    logger.info("user {user} requested citations from {url} based on metrics: {metrics} and search: {search}".format(user=user, url=url, metrics=metrics, search=search))

    response = extractSpecificPercentages(
        search=search,
        user=user,
        patentURL=url,
        metrics=metrics,
    )
    return response

@llmCalls.route("/getCitation", methods=["POST"])
def getCitation():
    """Route to extract highlighted text based on metrics for a given patent."""
    data = request.get_json()
    if data is None:
        logger.error("getCitation was called with no JSON data")
        return jsonify({"error": "No JSON data provided"}), 400
    
    requiredFields = {
        "user": str,
        "patentURL": str,
        "metric_str": str,
    }

    valid, errorMessage = validate_json(data, requiredFields)
    if not valid:
        logger.error(errorMessage)
        return jsonify({"error": errorMessage}), 400

    user = data.get("user")
    patentURL = data.get("patentURL")
    metric = data.get("metric_str")

    logger.info("user {user} requested citations from {url} based on {metric}".format(user=user, url=patentURL, metric=metric))

    response = extractCitaionsSingleMetric(
        user=user,
        patentURL=patentURL,
        metric=metric,
    )
    return response
