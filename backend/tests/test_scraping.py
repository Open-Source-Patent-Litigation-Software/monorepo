import pytest
import requests
import requests_mock
import re

from utils.scraping import PatentScraper  

def test_patent_scraper_valid_url(requests_mock):
    # Mock a valid URL response
    url = "http://example.com"
    html_content = '''
    <html>
        <body>
            <div class="section1">Section 1 Text</div>
            <div class="section2">Section 2 Text</div>
        </body>
    </html>
    '''
    requests_mock.get(url, text=html_content)
    
    # Create an instance of PatentScraper
    scraper = PatentScraper(url)
    
    # Test the scrapePatent method
    sections = ['section1', 'section2']
    result = scraper.scrapePatent(sections)
    
    # Verify the scraped data
    assert result == ["Section 1 Text", "Section 2 Text"]

def test_patent_scraper_invalid_url(requests_mock):
    # Mock an invalid URL response
    url = "http://invalid-url.com"
    requests_mock.get(url, status_code=404)
    
    with pytest.raises(Exception):
        PatentScraper(url)

def test_patent_scraper_empty_section(requests_mock):
    # Mock a valid URL response with no matching sections
    url = "http://example.com"
    html_content = '''
    <html>
        <body>
            <div class="other-section">Other Section Text</div>
        </body>
    </html>
    '''
    requests_mock.get(url, text=html_content)
    
    # Create an instance of PatentScraper
    scraper = PatentScraper(url)
    
    # Test the scrapePatent method with a non-existent section
    sections = ['section1']
    result = scraper.scrapePatent(sections)
    
    # Verify the scraped data
    assert result == [""]

def test_patent_scraper_nested_elements(requests_mock):
    # Mock a valid URL response with nested elements
    url = "http://example.com"
    html_content = '''
    <html>
        <body>
            <div class="section1">
                <div class="section1">
                    Nested Section 1 Text
                </div>
            </div>
            <div class="section2">Section 2 Text</div>
        </body>
    </html>
    '''
    requests_mock.get(url, text=html_content)
    
    # Create an instance of PatentScraper
    scraper = PatentScraper(url)
    
    # Test the scrapePatent method
    sections = ['section1', 'section2']
    result = scraper.scrapePatent(sections)
    
    # Verify the scraped data
    assert result == ["Nested Section 1 Text", "Section 2 Text"]

