from enum import Enum
from .zip import Zip

class PatentRetrievalFactory:
    class RequestType(Enum):
        ID = "ID"
        ZIP = "ZIP"

    def getHandler(requestType: str, data: dict):
        if requestType == PatentRetrievalFactory.RequestType.ZIP:
            object =  Zip(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")

        return object.handleRequest()