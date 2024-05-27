import requests
from bs4 import BeautifulSoup


def scrapeClaims(url, headers=None):
    """Scrapes claims 1-N from a given patent URL on Google Patents."""
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    claim_dependent_sections = soup.find_all(class_="claim")

    seen = set()  # Using a set for seen items
    newClaims = []

    # Extracting the claims from the patent
    for section in claim_dependent_sections:
        claim_text_sections = [
            claim_text.get_text(strip=True)
            for claim_text in section.find_all(class_="claim-text")
        ]

        for item in claim_text_sections:
            if item not in seen:
                seen.add(item)
                newClaims.append(item)

    return newClaims  # Returning the list of claims
