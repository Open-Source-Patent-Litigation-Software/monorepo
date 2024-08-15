# Standard library imports
import base64
import math
import requests

from flask import Blueprint, request, jsonify, send_file
from authlib.integrations.flask_oauth2 import ResourceProtector
from pydantic import BaseModel

from utils.scraping import PatentScraper
from utils.auth import Auth0JWTBearerTokenValidator
from .factory import PatentRetrievalFactory
from app.blueprints.aws_wrapper.aws import Dynamo

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://localhost:8000"
)
require_auth.register_token_validator(validator)


class DifScore(BaseModel):
    scores: list[int]
    total: int


class PatentObject(BaseModel):
    abstract: str
    title: str
    owner: str
    publication_date: str
    publication_id: str
    www_link: str
    score: DifScore
    inventors: list[str]


class SearchOutput(BaseModel):
    patents: list[PatentObject]


# Helper function to create PatentObject
def create_patent_object(patent: dict, scores: list[float]) -> PatentObject:
    int_scores = [math.floor(score * 10) for score in scores]
    total_score = sum(int_scores)
    score_obj = DifScore(scores=int_scores, total=total_score)

    return PatentObject(
        abstract=patent["abstract"],
        title=patent["title"],
        owner=patent["owner"],
        publication_date=patent["publication_date"],
        publication_id=patent["publication_id"],
        www_link=patent["www_link"],
        inventors=patent["inventors"],
        score=score_obj,
    )


@patentRetrieval.route("/makeQuery", methods=["POST"])
# @require_auth("user")
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    data = request.get_json()
    searchRequest = data["metrics"]
    endpoint = "https://api.projectpq.ai"
    route = "/search/102"
    url = endpoint + route
    n = 10
    result_type = "patent"
    after = "2016-01-01"
    params = {
        "q": searchRequest,
        "n": n,
        "type": result_type,
        "after": after,
        "token": PQ_AI_KEY,
    }
    response = requests.get(url, params=params)
    if response.status_code != 200:
        return (
            jsonify({"message": "Failed to retrieve data from the external API."}),
            500,
        )

    results = response.json().get("results")
    if not results:
        return jsonify({"message": "No results found."})

    texts = []
    for patent in results:
        scraper = PatentScraper(patent["id"])
        claims = scraper.getSection("claims")
        texts.append(patent["abstract"] + claims)

    metricsList = searchRequest.split("\n")
    jsonData = {"metrics": metricsList, "texts": texts}
    backendurl = "http://0.0.0.0:12345/api/rankScores"
    secondRes = requests.post(backendurl, json=jsonData)
    if secondRes.status_code != 200:
        return (
            jsonify({"message": "Failed to retrieve data from the backend API."}),
            500,
        )

    rankings = secondRes.json().get("scores")

    print("102")

    patent_objects = [
        create_patent_object(patent, rankings[index])
        for index, patent in enumerate(results)
    ]

    # Sort the patent objects by total score in descending order
    sorted_patent_objects = sorted(
        patent_objects, key=lambda x: x.score.total, reverse=True
    )

    search_output = SearchOutput(patents=sorted_patent_objects)
    return jsonify(search_output.dict()["patents"])


@patentRetrieval.route("/getPatentsByIDs", methods=["POST"])
@require_auth("user")
def getPatentsByIDs():
    """Get Patents by ID"""
    data = request.get_json()
    try:
        response = PatentRetrievalFactory.getHandler(
            PatentRetrievalFactory.RequestType.ID, data
        )
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": e}), 400


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


@patentRetrieval.route("/zipPatents", methods=["POST"])
def zipPatents():
    """Scrape patent PDFS from google patents, return a zip file of the patents"""
    data = request.get_json()
    try:
        zip_buffer, valid_patents, not_found_patents = (
            PatentRetrievalFactory.getHandler(
                PatentRetrievalFactory.RequestType.ZIP, data
            )
        )
        if valid_patents == False:
            return (
                jsonify(
                    {
                        "zip_file": "",
                        "additional_data": {
                            "message": "Failed to create Zip file.",
                            "not_found": not_found_patents,
                        },
                    }
                ),
                200,
            )
        base64_zip = base64.b64encode(zip_buffer.getvalue()).decode("utf-8")

        return (
            jsonify(
                {
                    "zip_file": base64_zip,
                    "additional_data": {
                        "message": "Successfully created zip file.",
                        "not_found": not_found_patents,
                    },
                }
            ),
            200,
        )

    except Exception as e:
        print("there was an exception", e)
        return jsonify({"error": e}), 400


@patentRetrieval.route("/getPatentInstance", methods=["POST"])
# @require_auth("user")
def getPatentInstance():
    """Get Patents by (user, instance_ids) from DynamoDB"""
    data = request.get_json()

    user = data["user"]  # Partition Key
    instance_ids = data["instance_ids"]  # Sort Key

    dynamo = Dynamo()  # Initialize DynamoDB client

    try:
        patents = []  # Initialize an empty list to store patent information
        # Define the partition key and sort key for querying
        for instance_id in instance_ids:
            key = {"user": user, "instance_id": instance_id}
            patentInfo = dynamo.getItem("patent_test", key)
            if patentInfo:
                patents.append(patentInfo)  # Append each patent to the list
            else:
                return (
                    jsonify(
                        {
                            "error": "Patents have not been uploaded yet or error in request."
                        }
                    ),
                    500,
                )

        response = {"Response": patents}
        return jsonify(response), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400
