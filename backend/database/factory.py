from enum import Enum
from os import environ
from dotenv import load_dotenv
from sqlalchemy.orm import Session
from .auth import Auth
from .cache import Cache
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


class DatabaseCall:
    """This class is used to create and commit objects to the database."""

    def __init__(self):
        self.session = SessionLocal()
        self.logger = logger = logging.getLogger("__name__")

    def createAndCommit(self, objects: list):
        """Create and commit objects to the database"""
        try:
            for obj in objects:
                self.session.add(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to commit objects: {e}")
            raise ValueError(f"Failed to commit objects: {e}")

    def deleteObject(self, obj):
        """Delete an object from the database."""
        try:
            self.session.delete(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            logger.error(f"Failed to delete object: {e}")
            raise ValueError(f"Failed to delete object: {e}")
