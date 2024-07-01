import requests
import logging
from app.settings import PQ_AI_KEY
import re

def extractPatentNum(url):
    pattern = r'/patent/([^/]+)/en'
    match = re.search(pattern, url)
    if match:
        return match.group(1)
    else:
        return None


class PatentScraper:
    def __init__(self, pn: str):
        self.logger = logging.getLogger("__name__")
        self.pn = pn

    # takes in patent number, and the field you want (abstract, claims or description)
    # returns that section or an empty string if an error
    def getSection(self, field):
        endpoint = "https://api.projectpq.ai"
        route = f'/patents/{self.pn}/{field}'
        url = endpoint + route
        params = { 
            "token": PQ_AI_KEY,  # API key
        }
        try:
            response = requests.get(url, params=params)  # send the request
            assert response.status_code == 200
            results = response.json().get(field)  # decode response
        except Exception as e:
            self.logger.error(e)
            return ""
        if isinstance(results, list):
            return '\n'.join(map(str, results))
        return results
