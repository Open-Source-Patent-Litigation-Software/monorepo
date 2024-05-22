from flask import Blueprint, jsonify, request
import json
from langchain_openai import OpenAI
from app.settings import OPEN_AI_KEY
from utils.metrics import extractTheMetrics

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")


@llmCalls.route("/obtainMetrics", methods=["POST"])
def obtainMetrics():
    """Route to extract metrics from a given text."""
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    query = data.get("query")
    metrics = extractTheMetrics(searchQuery=query, model="gpt-3.5-turbo-0125")

    def parseOutput(content):
        content = content.strip().strip("'").strip('"')
        parsed_content = json.loads(content)
        return parsed_content

    parsedMetrics = []
    maxTries = 5
    numAttempts = 0
    while len(parsedMetrics) > 8 or len(parsedMetrics) < 6 and numAttempts < maxTries:
        numAttempts += 1
        parsedMetrics = parseOutput(metrics)

    returnObject = {}
    for index in range(len(parsedMetrics)):
        returnObject[f"metric{index+1}"] = parsedMetrics[index]

    ### IMPLEMENT DATABASE CACHING OF QUERIES HERE ###

    return jsonify(returnObject), 200


@llmCalls.route("/obtainPercentages", methods=["POST"])
def obtainPercentages():
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    patent_id = data.get("patentID")
    search_query = data.get("searchQuery")
