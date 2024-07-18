import pytest
from app.blueprints.llmCalls.schemas import (  # Import your models from the correct module
    Quote,
    CitationsExtraction,
    CitationsInput,
    MetricExtraction,
    MetricInput,
    PercentagesInput,
    PercentExtraction,
    SummaryInput,
    SummaryExtraction,
)

from app.blueprints.patentRetrieval.schema import (  # Import your models from the correct module
    PatentIDInput,
    PatentIDOutput,
    ZipInput,
)

def test_patent_id_input_validator():
    # Test valid data
    valid_data = {"pn": "12345678", "user": "test_user"}
    patent_id_input = PatentIDInput(**valid_data)
    assert patent_id_input.pn == "12345678"
    assert patent_id_input.user == "test_user"

    # Test invalid data
    invalid_data = [
        {"pn": "", "user": "test_user"},
        {"pn": "12345678", "user": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            PatentIDInput(**data)

def test_patent_id_output_validator():
    # Test valid data
    valid_data = {
        "summary": "This is a summary.",
        "pubNum": "US12345678B1",
        "title": "Invention Title",
        "assignee": "Assignee Name",
        "appDate": "2024-07-10"
    }
    patent_id_output = PatentIDOutput(**valid_data)
    assert patent_id_output.summary == "This is a summary."
    assert patent_id_output.pubNum == "US12345678B1"
    assert patent_id_output.title == "Invention Title"
    assert patent_id_output.assignee == "Assignee Name"
    assert patent_id_output.appDate == "2024-07-10"

    # Test invalid data
    invalid_data = [
        {
            "summary": "",
            "pubNum": "US12345678B1",
            "title": "Invention Title",
            "assignee": "Assignee Name",
            "appDate": "2024-07-10"
        },
        {
            "summary": "This is a summary.",
            "pubNum": "",
            "title": "Invention Title",
            "assignee": "Assignee Name",
            "appDate": "2024-07-10"
        },
        {
            "summary": "This is a summary.",
            "pubNum": "US12345678B1",
            "title": "",
            "assignee": "Assignee Name",
            "appDate": "2024-07-10"
        },
        {
            "summary": "This is a summary.",
            "pubNum": "US12345678B1",
            "title": "Invention Title",
            "assignee": "",
            "appDate": "2024-07-10"
        },
        {
            "summary": "This is a summary.",
            "pubNum": "US12345678B1",
            "title": "Invention Title",
            "assignee": "Assignee Name",
            "appDate": ""
        }
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            PatentIDOutput(**data)

def test_zip_input_validator():
    # Test valid data
    valid_data = {"pns": ["12345678", "87654321"], "user": "test_user"}
    zip_input = ZipInput(**valid_data)
    assert zip_input.pns == ["12345678", "87654321"]
    assert zip_input.user == "test_user"

    # Test invalid data
    invalid_data = [
        {"pns": [], "user": "test_user"},
        {"pns": ["12345678", "87654321"], "user": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            ZipInput(**data)

def test_quote_validator():
    # Test valid data
    valid_data = {"before": "Before text", "highlight": "Highlight text", "after": "After text"}
    quote = Quote(**valid_data)
    assert quote.before == "Before text"
    assert quote.highlight == "Highlight text"
    assert quote.after == "After text"

    # Test invalid data
    invalid_data = [
        {"before": "", "highlight": "Highlight text", "after": "After text"},
        {"before": "Before text", "highlight": "", "after": "After text"},
        {"before": "Before text", "highlight": "Highlight text", "after": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            Quote(**data)

def test_citations_extraction_validator():
    # Test valid data
    valid_data = {
        "claims": [{"before": "Before text", "highlight": "Highlight text", "after": "After text"}],
        "abstract": []
    }
    citations_extraction = CitationsExtraction(**valid_data)
    assert citations_extraction.claims[0].before == "Before text"

    # Test invalid data
    invalid_data = {"claims": [], "abstract": []}
    with pytest.raises(Exception):
        CitationsExtraction(**invalid_data)

def test_citations_input_validator():
    # Test valid data
    valid_data = {"patentURL": "https://example.com", "metric": "metric", "user": "user"}
    citations_input = CitationsInput(**valid_data)
    assert citations_input.patentURL == "https://example.com"
    assert citations_input.metric == "metric"
    assert citations_input.user == "user"

    # Test invalid data
    invalid_data = [
        {"patentURL": "", "metric": "metric", "user": "user"},
        {"patentURL": "https://example.com", "metric": "", "user": "user"},
        {"patentURL": "https://example.com", "metric": "metric", "user": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            CitationsInput(**data)

def test_metric_extraction_validator():
    # Test valid data
    valid_data = {"functions": ["func1", "func2", "func3", "func4", "func5", "func6", "func7", "func8"]}
    metric_extraction = MetricExtraction(**valid_data)
    assert len(metric_extraction.functions) == 8

    # Test invalid data
    invalid_data = {"functions": ["func1", "func2", "func3"]}
    with pytest.raises(Exception):
        MetricExtraction(**invalid_data)

def test_metric_input_validator():
    # Test valid data
    valid_data = {"searchQuery": "query", "user": "user"}
    metric_input = MetricInput(**valid_data)
    assert metric_input.searchQuery == "query"
    assert metric_input.user == "user"

    # Test invalid data
    invalid_data = [
        {"searchQuery": "", "user": "user"},
        {"searchQuery": "query", "user": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            MetricInput(**data)

def test_percentages_input_validator():
    # Test valid data
    valid_data = {"searchQuery": "query", "user": "user", "patentURL": "https://example.com", "metrics": "metrics"}
    percentages_input = PercentagesInput(**valid_data)
    assert percentages_input.searchQuery == "query"
    assert percentages_input.user == "user"
    assert percentages_input.patentURL == "https://example.com"
    assert percentages_input.metrics == "metrics"

    # Test invalid data
    invalid_data = [
        {"searchQuery": "", "user": "user", "patentURL": "https://example.com", "metrics": "metrics"},
        {"searchQuery": "query", "user": "", "patentURL": "https://example.com", "metrics": "metrics"},
        {"searchQuery": "query", "user": "user", "patentURL": "", "metrics": "metrics"},
        {"searchQuery": "query", "user": "user", "patentURL": "https://example.com", "metrics": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            PercentagesInput(**data)

def test_percent_extraction_validator():
    # Test valid data
    valid_data = {"data": {"metric1": 0.1, "metric2": 0.2, "metric3": 0.3, "metric4": 0.4, "metric5": 0.5, "metric6": 0.6}}
    percent_extraction = PercentExtraction(**valid_data)
    assert len(percent_extraction.data) == 6

    # Test invalid data
    invalid_data = [
        {"data": {"metric1": 0.1, "metric2": 0.2, "metric3": 0.3, "metric4": 0.4, "metric5": 0.5}},
        {"data": {"metric1": 0.1, "metric2": 0.2, "metric3": 0.3, "metric4": 0.4, "metric5": 0.5, "metric6": 0.6, "metric7": 0.7, "metric8": 0.8, "metric9": 0.9, "metric10": 1.0, "metric11": 1.1}},
        {"data": {"metric1": "invalid", "metric2": 0.2}},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            PercentExtraction(**data)

def test_summary_input_validator():
    # Test valid data
    valid_data = {"patentURL": "https://example.com", "user": "user"}
    summary_input = SummaryInput(**valid_data)
    assert summary_input.patentURL == "https://example.com"
    assert summary_input.user == "user"

    # Test invalid data
    invalid_data = [
        {"patentURL": "", "user": "user"},
        {"patentURL": "https://example.com", "user": ""},
    ]
    for data in invalid_data:
        with pytest.raises(Exception):
            SummaryInput(**data)

def test_summary_extraction_validator():
    # Test valid data
    valid_data = {"summary": "This is a summary."}
    summary_extraction = SummaryExtraction(**valid_data)
    assert summary_extraction.summary == "This is a summary."

# Run all tests
if __name__ == "__main__":
    pytest.main()
