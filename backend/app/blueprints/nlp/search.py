from utils.schemas import SearchInput, SearchOutput
from app.settings import PQ_AI_KEY
import requests
from flask import jsonify
from utils.scraping import PatentScraper
from utils.schemas import PatentObject, DifScore
import math
import os

class Search:
    def __init__(self, data: dict):
        validatedInput = SearchInput(**data)
        
        # set up class for
        self.metrics = validatedInput.metrics
        self.user = validatedInput.user
        self.threshold = validatedInput.threshold
        self.numPatents = validatedInput.numPatents
        self.nlpURL = os.environ.get("NLP_URL") + "/api/rankScores"
        self.pqai = "https://api.projectpq.ai/search/102"
        self.nlpHeader = {"key": os.environ.get("NLP_KEY")}

    # Helper function to create PatentObject
    def __createPatent(self, patent: dict, scores: list[float]) -> PatentObject:
        # Define min and max for the given range
        min_score = 0.25
        max_score = 0.8
        
        # Normalize the scores
        normalized_scores = [(score - min_score) / (max_score - min_score) for score in scores]
        
        # Multiply by 10
        int_scores = [int(score * 10) for score in normalized_scores]
        
        # Calculate total score
        total_score = sum(int_scores)
        
        # Create the score object
        score_obj = DifScore(scores=int_scores, total=total_score)
        
        return PatentObject(
            abstract=patent["abstract"],
            title=patent["title"],
            owner=patent["owner"],
            publication_date=patent["publication_date"],
            publication_id=patent["publication_id"],
            www_link=patent["www_link"],
            inventors=patent["inventors"],
            score=score_obj
        )


    def __getPatents(self):
        # build the params
        params = {  
            "q": self.metrics, 
            "n": self.numPatents, 
            "type": "patent",  
            "after": "2016-01-01",  
            "token": PQ_AI_KEY,
        }
        
        # send the reequest
        response = requests.get(self.pqai, params=params)

        # handle the errors
        assert response.status_code == 200 

        # return the results if successful
        return response.json().get("results")

    def handleRequest(self):
        # get the patents from PQAI based on our search
        patents = self.__getPatents()

        claimsList = []
        abstractsList = []

        # we need to get the abstract + claims sections, we have the abstract already
        for patent in patents:
            scraper = PatentScraper(patent["id"])
            claims = scraper.getSection("claims")
            claimsList.append(claims)
            abstractsList.append(patent["abstract"])

        # split metrics in metrics list
        metricsList = self.metrics.split('\n')

        jsonData = {
            "metrics": metricsList,
            "claims": claimsList,
            "abstracts": abstractsList
        }

        secondRes = requests.post(self.nlpURL, json=jsonData, headers=self.nlpHeader)
        if secondRes.status_code != 200:
            return jsonify({"message": "Failed to retrieve data from the backend API."}), 500

        rankings = secondRes.json().get("scores")

        patent_objects = [self.__createPatent(patent, rankings[index]) for index, patent in enumerate(patents)]

        # Sort the patent objects by total score in descending order
        sorted_patent_objects = sorted(patent_objects, key=lambda x: x.score.total, reverse=True)

        # return the validated ouput
        return SearchOutput(patents=sorted_patent_objects).dict()["patents"]