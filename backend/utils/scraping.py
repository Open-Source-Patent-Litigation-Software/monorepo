import requests
import logging
from app.settings import PQ_AI_KEY
from bs4 import BeautifulSoup
import re


def extractPatentNum(url):
    pattern = r"/patent/([^/]+)/en"
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
        route = f"/patents/{self.pn}/{field}"
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
            return "\n".join(map(str, results))
        return results

    def getPDFLink(self, pn):
        url = f'https://patents.google.com/patent/{pn}/en'
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
        }
        response = requests.get(url, headers=headers)

        if response.status_code != 200:
            print(
                f"Failed to retrieve the page for patent ID {pn}. Status code: {response.status_code}"
            )
            return None

        soup = BeautifulSoup(response.content, "html.parser")
        pdf_link = None

        # Find the anchor element with the class 'style-scope patent-result' and extract the href attribute
        anchor_tag = soup.find("a", string="Download PDF")
        if anchor_tag:
            pdf_link = anchor_tag["href"]

        return pdf_link

    def scrapePDF(self, url):
        response = requests.get(url)
        if response.status_code == 200:
            return response.content
        else:
            print(
                f"Failed to download PDF from {url}. Status code: {response.status_code}"
            )
            return None
