from .citations import Citations
from .metrics import Metrics
from .percentages import Percentages

class LLMCallFactory:
    # takes in the request type, returns the handler class object, instantiated
    def getHandler(requestType: str, data: dict):
        if requestType == 'c':
            return Citations(data)
        elif requestType == 'm':
            return Metrics(data)
        elif requestType == 'p':
            return Percentages(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")