from .schema import SearchInput, SearchOutput
from app.settings import PQ_AI_KEY
import requests
from flask import jsonify
from utils.scraping import PatentScraper

class Search:
    def __init__(self, data: dict):
        validatedInput = SearchInput(**data)
        
        # set up class for
        self.metrics = validatedInput.metrics
        self.user = validatedInput.user
        self.threshold = validatedInput.threshold
        self.numPatents = validatedInput.numPatents

    def handleRequest(self):
        # build the params
        params = {  
            "q": self.metrics, 
            "n": self.numPatents, 
            "type": "patent",  
            "after": "2016-01-01",  
            "token": PQ_AI_KEY,
        }
        
        # send the reequest
        response = requests.get("https://api.projectpq.ai/search/102", params=params)  # send the request
        print(response)
        assert response.status_code == 200  # error check

        texts = []

        results = response.json().get("results")  # decode response
        for patent in results:
            scraper = PatentScraper(patent["id"])
            claims = scraper.getSection("claims")
            texts.append(patent["abstract"] + claims)

        metricsList = self.metrics.split('\n')

        jsonData = {
            "metrics": metricsList,
            "texts": texts
        }

        backendurl = "https://0.0.0.0:443"

        requests.post(backendurl, None, jsonify(jsonData))

        if not results:
            return jsonify({"message": "No results found."})
        return jsonify({"results": results})