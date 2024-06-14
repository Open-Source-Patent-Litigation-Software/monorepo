import pytest
from run import app

@pytest.fixture
def client():
    app.config['TESTING'] = True
    with app.test_client() as client:
        yield client

# Test the API Route
def testCitationsInvalidArgs(client):
    # empty payload
    emptyPayload = {}
    noArgsResponse = client.post('/llm/getCitation', json=emptyPayload)
    assert noArgsResponse.status_code == 400

    # empty string for one of the args
    emptyArgPayload = {
        "user": "test",
        "patentURL": "",
        "metric_str": "testing"
    }
    empytArgResponse = client.post('/llm/getCitation', json=emptyArgPayload)
    assert empytArgResponse.status_code == 400

    missingArgPayload = {
        "user": "test",
        "metric_str": "testing"
    }
    missingArgResponse = client.post('/llm/getCitation', json=missingArgPayload)
    assert missingArgResponse.status_code == 400

    invalidArgTypePayload = {
        "user": 10,
        "patentURL": "testing.com",
        "metric_str": "testing"
    }
    invalidArgTypeResponse = client.post('/llm/getCitation', json=invalidArgTypePayload)
    assert invalidArgTypeResponse.status_code == 400

def testInvalidPatent(client):
    # empty string for one of the args
    invalidPatentPayload = {
        "user": "test",
        "patentURL": "invalid.invalid",
        "metric_str": "testing"
    }
    empytArgResponse = client.post('/llm/getCitation', json=invalidPatentPayload)
    assert empytArgResponse.status_code == 400
