from enum import Enum
from dotenv import load_dotenv
from app.blueprints.saved.saver import Saver
from app.blueprints.saved.fetch_patent import FetchPatent
import logging

logger = logging.getLogger("__name__")


class DatabaseCallFactory:
    load_dotenv()

    class RequestType(Enum):
        SAVER = "SAVER"
        FETCH_PATENT = "FETCH_PATENT"

    @staticmethod
    def getHandler(requestType: "DatabaseCallFactory.RequestType"):
        if requestType == DatabaseCallFactory.RequestType.SAVER:
            return Saver()
        if requestType == DatabaseCallFactory.RequestType.FETCH_PATENT:
            return FetchPatent()
        else:
            logger.error("Database Handler Failed.")
            raise ValueError("Not a valid request")
