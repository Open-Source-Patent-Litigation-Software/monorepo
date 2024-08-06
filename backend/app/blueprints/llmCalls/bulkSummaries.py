from .llmRequests import LlmRequests
from .schemas import BulkInput, BulkExtraction
import requests
from app.settings import PQ_AI_KEY
from .baml_client.sync_client import b as bamlClient
from .baml_client.types import SummariesPayload


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

    def baml_generate_summaries(self, injection: str) -> SummariesPayload:
        summaries = bamlClient.WordDocSummaries(injection)
        return summaries

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
        LLM_Response = self.baml_generate_summaries(injection=patentInjection)
        return LLM_Response
