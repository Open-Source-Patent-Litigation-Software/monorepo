from flask import Blueprint, request, jsonify
import requests
from app.settings import PQ_AI_KEY
from utils.scraping import PatentScraper
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com",
    "http://localhost:8000"
)
require_auth.register_token_validator(validator)

@patentRetrieval.route("/makeQuery", methods=["POST"])
@require_auth("user")
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    data = request.get_json()
    print(data)
    searchRequest = data["metrics"]
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

@patentRetrieval.route("/getPatentsByIDs", methods=["POST"])
@require_auth("user")
def getPatentsByIDs():
    """Get Patents by ID"""
    # gets a list of IDS
    data = request.get_json()


    return (
        jsonify("test"),
        200,
    )  # 200 is the status code for success


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
