from sqlalchemy.exc import IntegrityError
from .models import SessionLocal, RegUser
import logging

logger = logging.getLogger(__name__)


class DatabaseCall:
    def __init__(self):
        self.session = SessionLocal()
        self.logger = logging.getLogger(__name__)

    def getOrCreateUser(self, auth0_user_id: str):
        # Try to fetch the user by Auth0 user ID
        user = self.session.query(RegUser).get(auth0_user_id)

        if user:
            # User exists, return the existing user
            return user
        else:
            # User doesn't exist, create a new one
            new_user = RegUser(
                id=auth0_user_id,  # Use Auth0 user ID as the primary key
                subscription_type="free",  # Default subscription type
            )

            try:
                self.session.add(new_user)
                self.session.commit()
                return new_user
            except IntegrityError:
                # In case of a race condition where the user was created between our check and insert
                self.session.rollback()
                return self.session.query(RegUser).get(auth0_user_id)

    def createAndCommit(self, objects: list):
        """Create and commit objects to the database"""
        try:
            for obj in objects:
                self.session.add(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            self.logger.error(f"Failed to commit objects: {e}")
            raise ValueError(f"Failed to commit objects: {e}")

    def deleteObject(self, obj):
        """Delete an object from the database."""
        try:
            self.session.delete(obj)
            self.session.commit()
        except Exception as e:
            self.session.rollback()
            self.logger.error(f"Failed to delete object: {e}")
            raise ValueError(f"Failed to delete object: {e}")

    def __del__(self):
        """Close the session when the object is destroyed"""
        self.session.close()
