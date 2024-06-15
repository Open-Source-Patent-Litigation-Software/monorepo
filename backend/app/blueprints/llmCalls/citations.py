from .llmRequests import LlmRequests
from .schemas import CitationsInput

class Citations(LlmRequests):
    def __init__(self, data: dict):
        print('doing something')
        try:
            validatedData = CitationsInput(**data)
            self.metric = validatedData.metric_str
            self.url = validatedData.patentURL
            self.user = validatedData.user
        except ValueError as e:
            raise ValueError(f"Invalid input: {e}")


    def handleRequest(self):
        # call the functions to scrape data
        print("getting data")