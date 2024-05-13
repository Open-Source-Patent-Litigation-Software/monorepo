import requests
from bs4 import BeautifulSoup

def scrapeHTML(url, headers=None):
    response = requests.get(url, headers=headers)
    response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
    
    soup = BeautifulSoup(response.text, "html.parser")
    print(soup)
    description_sections = soup.find_all(attrs={'itemprop': 'description'})
    
    text = ' '.join(section.get_text(strip=True) for section in description_sections)
    return text