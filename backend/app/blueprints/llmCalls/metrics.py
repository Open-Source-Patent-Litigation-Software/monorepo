from .llmRequests import LlmRequests

class Metrics(LlmRequests):
    def __init__(self, searchQuery: str, user: str):
        self.searchQuery = searchQuery
        self.user = user
        print("created Metrics Request")