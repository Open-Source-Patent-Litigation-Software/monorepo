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
        """Generate the summary of the patent."""
        template = f"""
        I am going to give you a list of a patent and its respespecitve claim, abstract, title. For each patent I want you to summarize what the patent is and the key features of it in 100 words.

        I want you to make sure you include all of the independent claims in the summary. Below are the patents and the respective claims and abstract sections for each one:

        {injection}

        I want you to output your response in JSON format like this:
        ```json
        {{
            "summary": "your summary goes here"
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
            claims = result["claims"]
            abstract = result["abstract"]
            patentInjection += (
                f"Patent Number: {patent}\n"
                f"Claims:\n{claims}\n"
                f"Abstract:\n{abstract}\n\n"
            )
        finalTemplate = self.generate_summary(injection=patentInjection)
        print("FINAL TEMPLATE", finalTemplate)
        # abstract, claims = patentInfo["abstract"], patentInfo["claims"]
        llmResponse = self.makeRequest(finalTemplate, BulkExtraction, {})
        return llmResponse
