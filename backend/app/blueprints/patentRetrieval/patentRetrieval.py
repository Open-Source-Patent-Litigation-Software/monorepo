from flask import Blueprint, request, jsonify
import requests
import logging
from app.settings import PQ_AI_KEY
from utils.scraping import scrapeClaims

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")

logger =  logging.getLogger("__name__")

@patentRetrieval.route("/makeQuery", methods=["GET"])
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    searchRequest = request.args.get("search")

    if searchRequest is None:
        logger.error("Missing searchRequest Param")
        return jsonify({"error": "Error"}), 400

    logger.info("patentRetrival initiated")

    endpoint = "https://api.projectpq.ai"

    # These are all tunable
    route = "/search/102"
    url = endpoint + route
    n = 10
    result_type = "patent"
    after = "2016-01-01"
    params = {  # create parameter object
        "q": searchRequest,  # search query
        "n": n,  # no. of results
        "type": result_type,  # exclude research papers
        "after": after,  # return patents published after this date
        "token": PQ_AI_KEY,  # API key
    }
    response = requests.get(url, params=params)  # send the request
    if response.status_code is 200:
        logger.error("Response code not 200")
        return jsonify({"error": "error"}), 400

    results = response.json().get("results")  # decode response
    if not results:
        return jsonify({"message": "No results found."})
    return jsonify({"results": results})


@patentRetrieval.route("/scrapeGooglePatents", methods=["GET"])
def scrapeGooglePatents():
    """Scrape Google Patents for a specific patent's claims."""
    googlePatentsURL = request.args.get("url")

    if not googlePatentsURL:
        logger.error("Missing args")
        return jsonify({"error": "Invalid args"}), 400
    
    logger.info("Scraping google claims from google patents")

    htmlOutput = scrapeClaims(url=googlePatentsURL)
    return (
        jsonify({"description": htmlOutput}),
        200,
    )  # 200 is the status code for success
