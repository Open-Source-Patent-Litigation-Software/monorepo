from .llmRequests import LlmRequests
from .schemas import BulkInput, BulkExtraction
import requests
from bs4 import BeautifulSoup
from app.settings import PQ_AI_KEY


class Bulk(LlmRequests):
    def __init__(self, data: dict):
        try:
            validatedInput = BulkInput(**data)
            self.patentNumbers = validatedInput.patent_ids

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            raise ValueError(f"Invalid input: {e}")

    def query_pq_ai(self, patent_number):
        """Query the PQ AI API for the patent information."""
        endpoint = "https://api.projectpq.ai"
        url = f"{endpoint}/patents/{patent_number}"
        params = {  # create parameter object
            "token": PQ_AI_KEY,  # API key
        }
        response = requests.get(url, params=params)
        return response.json()

    def generate_summary(self, injection: str):
        template = f"""
        I am going to give you a list of patents with their respective claims, abstracts, and titles. For each patent, summarize what the patent is about and its key features in 100 words.

        Make sure to include all of the independent claims in the summary. Below are the patents and their respective claims and abstract sections:

        {injection}

        Output your response in JSON format like this:
        ```json
        {{
            "summaries": [
                {{
                    "patent": "patent_number",
                    "title": "title_text",
                    "filing_date": "filing_date_text",
                    "summary": "summary_text"
                }},
                ...
            ]
        }}
        ```
        """
        return template

    def handleRequest(self):
        """Handle the request."""

        # Query the PQ AI API for the patent information
        rawResults = []
        for patentNumber in self.patentNumbers:
            rawResults.append(self.query_pq_ai(patentNumber))

        # Build the prompt injection
        patentInjection = ""
        for result in rawResults:
            patent = result["pn"]
            title = result["title"]
            filingDate = result["filing_date"]
            claims = result["claims"]
            abstract = result["abstract"]
            patentInjection += (
                f"Patent Number: {patent}\n"
                f"Title: {title}\n"
                f"Filing Date: {filingDate}\n"
                f"Claims:\n{claims}\n"
                f"Abstract:\n{abstract}\n\n"
            )
        finalTemplate = self.generate_summary(injection=patentInjection)
        llmResponse = self.makeRequest(
            template=finalTemplate, validator=BulkExtraction, args={}
        )
        return llmResponse
