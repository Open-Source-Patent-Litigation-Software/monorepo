from flask import Blueprint, request, jsonify, send_file
import base64
from utils.scraping import PatentScraper
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator
from .factory import PatentRetrievalFactory

patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")

require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com",
    "http://localhost:8000"
)
require_auth.register_token_validator(validator)

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
        zip_buffer, valid_patents, not_found_patents = PatentRetrievalFactory.getHandler(PatentRetrievalFactory.RequestType.ZIP, data)
        if valid_patents == False:
            return jsonify({
                "zip_file": "",
                "additional_data": {
                    "message": "Failed to create Zip file.", 
                    "not_found": not_found_patents
                }
            }), 200
        base64_zip = base64.b64encode(zip_buffer.getvalue()).decode('utf-8')
        

        return jsonify({
            "zip_file": base64_zip,
            "additional_data": {
                "message": "Successfully created zip file.", 
                "not_found": not_found_patents
            }
        }), 200
        
    except Exception as e:
        print("there was an exception", e)
        return jsonify({"error": e}), 400
