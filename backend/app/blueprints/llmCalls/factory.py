from .citations import Citations
from .metrics import Metrics
from .percentages import Percentages
from .summary import Summary
from enum import Enum


class LLMCallFactory:
    class RequestType(Enum):
        CITATIONS = "CITATIONS"
        SUMMARY = "SUMMARY"
        PERCENTAGES = "PERCENTAGES"
        METRICS = "METRICS"

    def getHandler(requestType: str, data: dict):
        """Get the handler object based on the request type."""
        if requestType == LLMCallFactory.RequestType.CITATIONS:
            object = Citations(data)
        elif requestType == LLMCallFactory.RequestType.METRICS:
            object = Metrics(data)
        elif requestType == LLMCallFactory.RequestType.PERCENTAGES:
            object = Percentages(data)
        elif requestType == LLMCallFactory.RequestType.SUMMARY:
            object = Summary(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")

        return object.handleRequest()
