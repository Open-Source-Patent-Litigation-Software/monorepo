from .models import SessionLocal
import logging

logger = logging.getLogger("__name__")

class DatabaseCall:
    """This class is used to create and commit objects to the database."""

    def __init__(self):
        self.session = SessionLocal()
        self.logger = logging.getLogger("__name__")

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
