import requests
from bs4 import BeautifulSoup
import logging
import re

class PatentScraper:
    def __init__(self, url: str):
        try:
            response = requests.get(url, headers=None)
            response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes

            response.encoding = 'utf-8'
            response_text = response.text
        except requests.RequestException as e:
            raise(f"URL failed: {e}")
        self.logger = logging.getLogger("__name__")
        self.soup = BeautifulSoup(response_text, "html.parser")
        self.url = url

    # takes in a list of sections, returns a list of strings (the scraped data)
    def scrapePatent(self, sections):
        scrapedSections = []
        for section in sections:
            htmlElements = self.soup.find_all(class_=re.compile(rf'\b{section}\b'))

            # if there are no elements in this section, return an empty string
            if htmlElements is None:
                scrapedSections.append("")
                self.logger.warning(f"scraped no data from {self.url} for section {section}.")
                continue
            
            # list of scraped text from within this section
            scrapedText = []

            for element in htmlElements:
                if element.find(class_=re.compile(rf'\b{section}\b')):
                    continue  # Skip this element if it contains nested elements

                # seperate out the text
                elementText = element.get_text(separator=' ', strip=True)

                # append to scraped text for this section
                scrapedText.append(elementText)

            # append the text for this section
            scrapedSections.append("\n".join(scrapedText))
        return scrapedSections