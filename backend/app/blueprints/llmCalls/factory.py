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

    # takes in the request type, returns the handler class object, instantiated
    def getHandler(requestType: str, data: dict):
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
