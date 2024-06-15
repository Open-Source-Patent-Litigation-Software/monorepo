from .llmRequests import LlmRequests

class Percentages(LlmRequests):
    def __init__(self, searchQuery: str, user: str, patentURL: str, metrics: str):
        self.searchQuery = searchQuery
        self.user = user
        self.patentURL = patentURL
        self.metrics = metrics
        print("created Percentage request")