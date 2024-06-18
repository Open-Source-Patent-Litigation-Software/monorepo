from enum import Enum
from os import environ
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from .auth import Auth
from .models import SessionLocal
import logging

logger = logging.getLogger("__name__")





class DatabaseCallFactory:
    load_dotenv()
    CONNECTION_STRING = environ.get("EXPERIMENTAL_CONNECTION_STRING")


    class RequestType(Enum):
        AUTH = "AUTH"
        CACHE = "CACHE"
        ENTITY = "ENTITY"
        SEARCH = "SEARCH"

    @staticmethod
    def getHandler(requestType: "DatabaseCallFactory.RequestType"):
        # Create a session to be used
        session = SessionLocal()
        if requestType == DatabaseCallFactory.RequestType.AUTH:
            return Auth(session)
        else:
            logger.error("Database Handler Failed.")
            raise ValueError("Not a valid request")
