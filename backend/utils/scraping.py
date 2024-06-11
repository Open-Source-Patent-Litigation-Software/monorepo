import requests
from bs4 import BeautifulSoup


def scrapeClaims(url, headers=None):
    """Scrapes claims 1-N from a given patent URL on Google Patents."""
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes

        response.encoding = 'utf-8'
        response_text = response.text
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

    soup = BeautifulSoup(response_text, "html.parser")
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

def scrapeAbstract(url, headers=None):
    """Scrapes abstract from a given patent URL on Google Patents."""
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()

        response.encoding = 'utf-8'
        response_text = response.text
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None
    
    soup = BeautifulSoup(response_text, "html.parser")
    abstract_element = soup.find('abstract')

    if abstract_element == None:
        return ""

    # Extract the text from the <abstract> element
    abstract_text = abstract_element.get_text(separator=' ', strip=True)

    return abstract_text

def scrapeDescription(url, headers=None):
    """Scrapes description from a given patent URL on Google Patents."""
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
        
        # Ensure the response is decoded using UTF-8
        response.encoding = 'utf-8'
        response_text = response.text
        
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None
    
    soup = BeautifulSoup(response_text, "html.parser")

    description_element = soup.find_all(class_="description-paragraph")

    if description_element is None:
        return []
    
    descriptions = []

    for description in description_element:
        description_text = description.get_text(separator=' ', strip=True)
        descriptions.append(description_text)

    return descriptions