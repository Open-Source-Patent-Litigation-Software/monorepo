from flask import Blueprint, jsonify, request
from langchain_openai import OpenAI
from app.settings import OPEN_AI_KEY
from utils.metrics import extractTheMetrics, parseOutput

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")

"""Creating an instance of theobt LLM class."""
llm = OpenAI(api_key=OPEN_AI_KEY)


@llmCalls.route("/analyze", methods=["GET"])
def askQuestion():
    """Route to ask a question to the LLM model."""
    llm.invoke(
        "What are some theories about the relationship between unemployment and inflation?"
    )
    for chunk in llm.stream(
        "What are some theories about the relationship between unemployment and inflation?"
    ):
        print(chunk, end="", flush=True)
    return jsonify({"message": "Ask question route is working!"})


@llmCalls.route("/obtainMetrics", methods=["POST"])
def obtainMetrics():
    """Route to extract metrics from a given text."""
    data = request.get_json()
    if data is None:
        return jsonify({"error": "No JSON data provided"}), 400
    query = data.get("query")
    metrics = extractTheMetrics(searchQuery=query, model="gpt-3.5-turbo-0125")

    # Guarantee that the metrics are parsed
    # correctly and a sufficient
    # number of metrics are returned.
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
