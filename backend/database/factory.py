from enum import Enum
from dotenv import load_dotenv
from .saver import Saver
import logging

logger = logging.getLogger("__name__")


class DatabaseCallFactory:
    load_dotenv()

    class RequestType(Enum):
        SAVER = "SAVER"

    @staticmethod
    def getHandler(requestType: "DatabaseCallFactory.RequestType"):
        if requestType == DatabaseCallFactory.RequestType.SAVER:
            return Saver()
        else:
            logger.error("Database Handler Failed.")
            raise ValueError("Not a valid request")
