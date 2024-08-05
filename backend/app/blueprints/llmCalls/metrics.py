from .llmRequests import LlmRequests
from .schemas import MetricInput, MetricExtraction
from .baml_client.sync_client import b as bamlClient


class Metrics(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedInput = MetricInput(**data)

            # set the variables
            self.searchQuery = validatedInput.searchQuery
            self.user = validatedInput.user

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")

    def handleRequest(self):
        try:
            metrics = bamlClient.ExtractPatentMetricsFromQuery(self.searchQuery)
            return {"functions": metrics.sentences}
        except Exception as e:
            raise ValueError(
                f"An unexpected error occurred in handleRequest() in metrics.py: {str(e)}"
            )
