# tests/test_llmcalls_routes.py
from unittest.mock import patch

@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
@patch('app.blueprints.llmCalls.factory.LLMCallFactory.getHandler')
def test_obtain_metrics(mock_get_handler, mock_auth, client, auth_headers):
    mock_get_handler.return_value = {"metric": "value"}

    response = client.post('/llm/obtainMetrics', json={"some": "data"}, headers=auth_headers)

    assert response.status_code == 200
    assert response.json == {"metric": "value"}

@patch('utils.auth.Auth0JWTBearerTokenValidator.__init__', lambda self, domain, audience: None)
@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
def test_extract_specific_patent_metrics_real(mock_auth, client, auth_headers):
    # Given input data
    input_data = {
        "searchQuery": "a machine that makes coffee.",
        "user": "user"
    }

    response = client.post('/llm/obtainMetrics', json=input_data, headers=auth_headers)

    assert response.status_code == 200

    response_json = response.json
    assert "functions" in response_json

@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
@patch('app.blueprints.llmCalls.factory.LLMCallFactory.getHandler')
def test_extract_specific_patent_metrics(mock_get_handler, mock_auth, client, auth_headers):
    mock_get_handler.return_value = {"percentage": "value"}

    response = client.post('/llm/extractSpecificPatentMetrics', json={"some": "data"}, headers=auth_headers)
    assert response.status_code == 200
    assert response.json == {"percentage": "value"}

@patch('utils.auth.Auth0JWTBearerTokenValidator.__init__', lambda self, domain, audience: None)
@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
def test_extract_specific_patent_metrics_real(mock_auth, client, auth_headers):
    # Given input data
    input_data = {
        "searchQuery": "Specifically, we are seeking to understand the W-3 FAD gene and what has been filed relating to this gene in micro algae. The W-3 FAD gene encodes the omega-3 fatty acid desaturase enzyme and has been shown to enhance lipid retention in Nannochloropsis and Chlorella",
        "user": "user",
        "patentURL": "https://patents.google.com/patent/US9518277B2/en",
        "metrics": "Encodes omega-3 fatty acid desaturase enzyme.%_Enhances lipid retention in Nannochloropsis.%_Enhances lipid retention in Chlorella.%_Related to micro algae.%_Gene associated with W-3 FAD.%_Plays a role in lipid metabolism.%_Research shows increased omega-3 production.%_Contributes to lipid biosynthesis."
    }

    response = client.post('/llm/extractSpecificPatentMetrics', json=input_data, headers=auth_headers)

    assert response.status_code == 200

    response_json = response.json
    assert "data" in response_json

@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
@patch('app.blueprints.llmCalls.factory.LLMCallFactory.getHandler')
def test_get_citation(mock_get_handler, mock_auth, client, auth_headers):
    mock_get_handler.return_value = {"citation": "value"}

    response = client.post('/llm/getCitation', json={"some": "data"}, headers=auth_headers)

    assert response.status_code == 200
    assert response.json == {"citation": "value"}

@patch('utils.auth.Auth0JWTBearerTokenValidator.__init__', lambda self, domain, audience: None)
@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
def test_get_citation_real(mock_auth, client, auth_headers):
    # Given input data
    input_data = {
        "patentURL": "https://patents.google.com/patent/US10905276B2/en",
        "metric": "this is a test",
        "user": "user"
    }

    response = client.post('/llm/getCitation', json=input_data, headers=auth_headers)

    assert response.status_code == 200

    response_json = response.json
    assert "claims" in response_json
    assert "abstract" in response_json

@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
@patch('app.blueprints.llmCalls.factory.LLMCallFactory.getHandler')
def test_get_summary(mock_get_handler, mock_auth, client, auth_headers):
    mock_get_handler.return_value = {"summary": "value"}

    response = client.post('/llm/getSummary', json={"some": "data"}, headers=auth_headers)

    assert response.status_code == 200
    assert response.json == {"summary": "value"}

@patch('utils.auth.Auth0JWTBearerTokenValidator.__init__', lambda self, domain, audience: None)
@patch('authlib.oauth2.rfc7523.JWTBearerTokenValidator.validate_token', return_value=True)
def test_get_summary_real(mock_auth, client, auth_headers):
    # Given input data
    input_data = {
        "patentURL": "https://patents.google.com/patent/US10905276B2/en",
        "user": "user"
    }

    response = client.post('/llm/getSummary', json=input_data, headers=auth_headers)

    assert response.status_code == 200

    response_json = response.json
    assert "summary" in response_json