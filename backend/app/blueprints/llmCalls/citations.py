from .llmRequests import LlmRequests
from .schemas import CitationsInput
import requests


class Citations(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedData = CitationsInput(**data)

            # set the variables
            self.metrics = validatedData.metrics
            self.url = validatedData.patentURL
            self.user = validatedData.user

            self.sections = ["claims", "abstract", "description"]

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")

    # This function handles the LLM request, returning the validated output
    def handleRequest(self):
        # get the claims, abstract and description section. This will be a list of the three section in order.
        scrapedData = self.scrapePatent(self.sections, self.url)

        jsonData = {
            "metrics": self.metrics,
            "claims": scrapedData[0],
            "abstract": scrapedData[1],
            "description": scrapedData[2]
        }

        backendurl = "http://0.0.0.0:12345/api/citation"
        response = requests.post(backendurl, json=jsonData)
        data = response.json().get("data")

        # return the result
        return data
