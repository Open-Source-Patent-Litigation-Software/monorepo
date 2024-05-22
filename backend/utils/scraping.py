import requests
from bs4 import BeautifulSoup


def scrapeHTML(url, headers=None):
    """Scrapes claims 1-N from a given patent URL on Google Patents."""
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
    soup = BeautifulSoup(response.text, "html.parser")
    claim_dependent_sections = soup.find_all(class_="claim")

    seen = {}
    newClaims = []

    # Extracting the claims from the patent
    for section in claim_dependent_sections:
        claim_text_sections = [
            claim_text.get_text(strip=True)
            for claim_text in section.find_all(class_="claim-text")
        ]
        for item in claim_text_sections:
            if item not in seen:
                seen[item] = True
                newClaims.append(item)

    parsedTags = "\n".join(newClaims)
    return parsedTags


# html = scrapeHTML("https://patents.google.com/patent/US10911468B2/en?q=(machine)&oq=machine")
html = scrapeHTML("https://patents.google.com/patent/US10218892B2/en")
with open("output.txt", "w", encoding="utf-8") as file:
    file.write(html)
