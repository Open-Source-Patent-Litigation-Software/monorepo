from enum import Enum
from .description import DescriptionSearch
from .id import IDSearch
from .zip import Zip

class PatentRetrievalFactory:
    class RequestType(Enum):
        DESCRIPTION = "DESCRIPTION"
        ID = "ID"
        ZIP = "ZIP"

    def getHandler(requestType: str, data: dict):
        if requestType == PatentRetrievalFactory.RequestType.DESCRIPTION:
            object = DescriptionSearch(data)
        elif requestType == PatentRetrievalFactory.RequestType.ID:
            object =  IDSearch(data)
        elif requestType == PatentRetrievalFactory.RequestType.ZIP:
            object =  Zip(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")

        return object.handleRequest()