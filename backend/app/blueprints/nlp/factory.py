from enum import Enum
from .citations import Citations
from .search import Search


class NLPFactory:
    class RequestType(Enum):
        SEARCH = "SEARCH"
        CITATIONS = "CITATIONS"

    # takes in the request type, returns the handler class object, instantiated
    def getHandler(self, requestType: str, data: dict):
        if requestType == NLPFactory.RequestType.CITATIONS:
            object = Citations(data)
        elif requestType == NLPFactory.RequestType.SEARCH:
            object = Search(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")

        return object.handleRequest()
