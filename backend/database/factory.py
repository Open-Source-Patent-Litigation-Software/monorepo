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
        else:
            logger.error("Database Handler Failed.")
            raise ValueError("Not a valid request")


class DatabaseCall:
    """This class is used to create and commit objects to the database."""

    def __init__(self):
        self.session = SessionLocal()

    def createAndCommit(self, objects: list):
        try:
            for obj in objects:
                self.session.add(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to commit objects: {e}")
            raise ValueError(f"Failed to commit objects: {e}")

    def deleteObject(self, obj):
        try:
            self.session.delete(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to delete object: {e}")
            raise ValueError(f"Failed to delete object: {e}")
