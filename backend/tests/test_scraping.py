# tests/test_scraping.py
import requests
import requests_mock
import pytest
from utils.scraping import scrapeClaims, scrapeAbstract, scrapeDescription

@pytest.fixture
def mock_requests():
    with requests_mock.Mocker() as m:
        yield m

def test_scrapeClaims(mock_requests):
    url = "http://example.com/patent"
    html_content = """
    <html>
    <body>
        <div class="claim">
            <div class="claim-text">Claim 1 text</div>
        </div>
        <div class="claim">
            <div class="claim-text">Claim 2 text</div>
        </div>
    </body>
    </html>
    """
    mock_requests.get(url, text=html_content)

    claims = scrapeClaims(url)
    assert claims == "Claim 1 text\nClaim 2 text"

def test_scrapeAbstract(mock_requests):
    url = "http://example.com/patent"
    html_content = """
    <html>
    <body>
        <abstract>Abstract text</abstract>
    </body>
    </html>
    """
    mock_requests.get(url, text=html_content)

    abstract = scrapeAbstract(url)
    assert abstract == "Abstract text"

def test_scrapeDescription(mock_requests):
    url = "http://example.com/patent"
    html_content = """
    <html>
    <body>
        <div class="description-paragraph">Description paragraph 1</div>
        <div class="description-paragraph">Description paragraph 2</div>
    </body>
    </html>
    """
    mock_requests.get(url, text=html_content)

    descriptions = scrapeDescription(url)
    assert descriptions == "Description paragraph 1\nDescription paragraph 2"

def test_scrapeClaims_no_claims(mock_requests):
    url = "http://example.com/patent"
    html_content = "<html><body>No claims here</body></html>"
    mock_requests.get(url, text=html_content)

    claims = scrapeClaims(url)
    assert claims == ''

def test_scrapeAbstract_no_abstract(mock_requests):
    url = "http://example.com/patent"
    html_content = "<html><body>No abstract here</body></html>"
    mock_requests.get(url, text=html_content)

    abstract = scrapeAbstract(url)
    assert abstract == ""

def test_scrapeDescription_no_description(mock_requests):
    url = "http://example.com/patent"
    html_content = "<html><body>No description here</body></html>"
    mock_requests.get(url, text=html_content)

    descriptions = scrapeDescription(url)
    assert descriptions == ''
