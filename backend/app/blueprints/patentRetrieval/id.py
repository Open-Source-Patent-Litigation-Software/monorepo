from app.settings import PQ_AI_KEY
from .schema import PatentIDInput
from app.blueprints.llmCalls.summary import Summary
import requests

class IDSearch:
    def __init__(self, data: dict):
        validatedInput = PatentIDInput(**data)

        # set the variables
        self.pn = validatedInput.pn
        self.user = validatedInput.user
    
    def handleRequest(self):
        data = {
            "user": self.user,
            "patentURL": f'https://patents.google.com/patent/{self.pn}/en'
        }
        summaryObject = Summary(data)
        summaryDict = summaryObject.handleRequest()

        endpoint = "https://api.projectpq.ai"
        route = "/documents/"
        url = endpoint + route
        params = {  # create parameter object
            "id": self.pn,
            "token": PQ_AI_KEY  # API key
        }
        response = requests.get(url, params=params)  # send the request
        assert response.status_code == 200
        results = response.json()  # decode response
        
        output = {
            "title": results.get("title"),
            "summary": summaryDict.get("summary"),
            "pubNum": results.get("publication_id"),
            "appDate": results.get("publication_date"),
            "assignee": results.get("owner")
        }
        return output