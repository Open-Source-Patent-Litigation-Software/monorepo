from enum import Enum
from .description import DescriptionSearch
from .id import IDSearch

class PatentRetrievalFactory:
    class RequestType(Enum):
        DESCRIPTION = "DESCRIPTION"
        ID = "ID"

    def getHandler(requestType: str, data: dict):
        if requestType == PatentRetrievalFactory.RequestType.DESCRIPTION:
            object = DescriptionSearch(data)
        elif requestType == PatentRetrievalFactory.RequestType.ID:
            object =  IDSearch(data)
        else:
            # if the request type doesn't exist throw an error
            raise ValueError("not a valid request")

        return object.handleRequest()