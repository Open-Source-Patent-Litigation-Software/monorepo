import pytest
import requests
from unittest.mock import patch, Mock
from bs4 import BeautifulSoup
import logging
import sys

from utils.scraping import extractPatentNum, PatentScraper  # Adjust import as necessary

# Test extractPatentNum
def test_extractPatentNum_valid_url():
    url = "https://patents.google.com/patent/US1234567A/en"
    assert extractPatentNum(url) == "US1234567A"

def test_extractPatentNum_invalid_url():
    url = "https://patents.google.com/patent/invalid"
    assert extractPatentNum(url) is None

def test_extractPatentNum_no_match():
    url = "https://patents.google.com/"
    assert extractPatentNum(url) is None

# Test PatentScraper.__init__
def test_patent_scraper_init():
    scraper = PatentScraper("US1234567A")
    assert scraper.pn == "US1234567A"
    assert isinstance(scraper.logger, logging.Logger)

# Test PatentScraper.getSection
@patch('requests.get')
def test_getSection_success(mock_get):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {'abstract': 'Sample abstract text'}
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.getSection('abstract')
    assert result == 'Sample abstract text'

@patch('requests.get')
def test_getSection_empty_response(mock_get):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.json.return_value = {}
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.getSection('abstract')
    assert result == '' or result == None

@patch('requests.get')
def test_getSection_exception(mock_get):
    mock_get.side_effect = Exception("API request failed")

    scraper = PatentScraper("US1234567A")
    result = scraper.getSection('abstract')
    assert result == ''

# Test PatentScraper.getPDFLink
@patch('requests.get')
def test_getPDFLink_success(mock_get):
    html_content = '''
    <html>
        <body>
            <a class="style-scope patent-result" href="/patent/US1234567A/en">Download PDF</a>
        </body>
    </html>
    '''
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.content = html_content
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.getPDFLink("US1234567A")
    assert result == "/patent/US1234567A/en"

@patch('requests.get')
def test_getPDFLink_no_anchor_tag(mock_get):
    html_content = '''
    <html>
        <body>
        </body>
    </html>
    '''
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.content = html_content
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.getPDFLink("US1234567A")
    assert result is None

@patch('requests.get')
def test_getPDFLink_failed_request(mock_get):
    mock_response = Mock()
    mock_response.status_code = 404
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.getPDFLink("US1234567A")
    assert result is None

# Test PatentScraper.scrapePDF
@patch('requests.get')
def test_scrapePDF_success(mock_get):
    mock_response = Mock()
    mock_response.status_code = 200
    mock_response.content = b'PDF content'
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.scrapePDF("http://example.com/pdf")
    assert result == b'PDF content'

@patch('requests.get')
def test_scrapePDF_failed_download(mock_get):
    mock_response = Mock()
    mock_response.status_code = 404
    mock_get.return_value = mock_response

    scraper = PatentScraper("US1234567A")
    result = scraper.scrapePDF("http://example.com/pdf")
    assert result is None

if __name__ == "__main__":
    logging.basicConfig(stream=sys.stderr)
    logging.getLogger("Test").setLevel(logging.DEBUG)
    pytest.main()
