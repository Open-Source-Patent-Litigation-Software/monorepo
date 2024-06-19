from enum import Enum
from dotenv import load_dotenv
from .auth import Auth
from .cache import Cache
import logging

logger = logging.getLogger("__name__")


class DatabaseCallFactory:
    load_dotenv()

    class RequestType(Enum):
        AUTH = "AUTH"
        CACHE = "CACHE"
        ENTITY = "ENTITY"
        SEARCH = "SEARCH"

    @staticmethod
    def getHandler(requestType: "DatabaseCallFactory.RequestType"):
        # Create a session to be used
        if requestType == DatabaseCallFactory.RequestType.AUTH:
            return Auth()
        elif requestType == DatabaseCallFactory.RequestType.CACHE:
            return Cache()
        elif requestType == DatabaseCallFactory.RequestType.ENTITY:
            # TODO: Implement Entity Handler
            pass
        elif requestType == DatabaseCallFactory.RequestType.SEARCH:
            # TODO: Implement Search Handler
            pass
        else:
            logger.error("Database Handler Failed.")
            raise ValueError("Not a valid request")
