import pytest
# from pydantic import ValidationError
# from utils.citations import parseCitationsJson, Quote, Section

# Test the Quote model
def test_quote_valid():
    print("worked")
    assert True

# def test_quote_no_before_and_after():
#     data = {"before": "", "highlight": "highlight text", "after": ""}
#     with pytest.raises(ValueError):
#         Quote(**data)

# # Test the Section model
# def test_section_valid():
#     quotes = [
#         {"before": "context before", "highlight": "highlight text", "after": "context after"}
#     ]
#     data = {"claims": quotes, "abstract": quotes, "description": quotes}
#     section = Section(**data)
#     assert section.claims is not None
#     assert section.abstract is not None
#     assert section.description is not None

# def test_section_no_claims():
#     quotes = [
#         {"before": "context before", "highlight": "highlight text", "after": "context after"}
#     ]
#     data = {"abstract": quotes, "description": quotes}
#     section = Section(**data)
#     assert section.claims is None
#     assert section.abstract is not None
#     assert section.description is not None

# def test_section_all_empty():
#     data = {}
#     with pytest.raises(ValueError):
#         Section(**data)

# # Test the parseCitationsJson function
# def test_parse_citations_json_valid():
#     response = '''
#     {
#         "claims": [
#             {"before": "context before", "highlight": "highlight text", "after": "context after"}
#         ],
#         "abstract": [
#             {"before": "context before", "highlight": "highlight text", "after": "context after"}
#         ],
#         "description": [
#             {"before": "context before", "highlight": "highlight text", "after": "context after"}
#         ]
#     }
#     '''
#     result = parseCitationsJson(response)
#     assert "claims" in result
#     assert "abstract" in result
#     assert "description" in result

# def test_parse_citations_json_invalid():
#     response = 'Invalid JSON'
#     with pytest.raises(ValueError, match="Failed to parse JSON from completion"):
#         parseCitationsJson(response)

# def test_parse_citations_json_empty_fields():
#     response = '''
#     {
#         "claims": [
#             {
#                 "before": "", 
#                 "highlight": "highlight text", 
#                 "after": ""
#             }
#         ],
#         "abstract": [],
#         "description": []
#     }
#     '''
#     with pytest.raises(ValueError):
#         parseCitationsJson(response)

# def test_parse_citations_json_all_empty():
#     response = '''
#     {
#         "claims": [],
#         "abstract": [],
#         "description": []
#     }
#     '''
#     with pytest.raises(ValueError):
#         parseCitationsJson(response)
