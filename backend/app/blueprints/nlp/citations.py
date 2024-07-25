from typing import List
from utils.schemas import CitationsInput
from utils.scraping import PatentScraper, extractPatentNum
import requests
import os

class Citations:
    def __init__(self, data: dict):
        # validate the JSON data recieved from the client
        validatedData = CitationsInput(**data)

        # set the variables
        self.metrics = validatedData.metrics
        self.url = validatedData.patentURL
        self.user = validatedData.user

        self.sections = ["claims", "abstract", "description"]
        self.nlpURL = os.environ.get("NLP_URL") + "/api/citation"
    
    def __scrapePatent(self, sections: List[str], url: str) -> List[str]:
        # create the scraping object
        pn = extractPatentNum(url)
        scraper = PatentScraper(pn)

        output = []

        for section in sections:
            temp = scraper.getSection(section)
            output.append(temp)

        # return the outputted list from scraping
        return output

    # This function handles the LLM request, returning the validated output
    def handleRequest(self):
        # get the claims, abstract and description section. This will be a list of the three section in order.
        scrapedData = self.__scrapePatent(self.sections, self.url)

        jsonData = {
            "metrics": self.metrics,
            "claims": scrapedData[0],
            "abstract": scrapedData[1],
            "description": scrapedData[2]
        }

        response = requests.post(self.nlpURL, json=jsonData)

        # implement error hanlding!
        data = response.json().get("data")

        # return the result
        return data
