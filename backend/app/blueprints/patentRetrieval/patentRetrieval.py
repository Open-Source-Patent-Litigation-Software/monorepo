from flask import Blueprint, request, jsonify
import requests
from app.settings import PQ_AI_KEY
from utils.scraping import PatentScraper

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")


@patentRetrieval.route("/makeQuery", methods=["GET"])
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    searchRequest = request.args.get("search")
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
    assert response.status_code == 200  # error check

    results = response.json().get("results")  # decode response
    if not results:
        return jsonify({"message": "No results found."})
    return jsonify({"results": results})


@patentRetrieval.route("/scrapeGooglePatents", methods=["GET"])
def scrapeGooglePatents():
    """Scrape Google Patents for a specific patent's claims."""
    googlePatentsURL = request.args.get("url")
    patentScraper = PatentScraper(url=googlePatentsURL)
    htmlOutput = patentScraper.scrapePatent(["claims"])
    return (
        jsonify({"description": htmlOutput}),
        200,
    )  # 200 is the status code for success
