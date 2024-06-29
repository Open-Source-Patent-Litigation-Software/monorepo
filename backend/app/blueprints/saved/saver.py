from database.databaseCall import DatabaseCall
from .schema import PatentData
from database.models import SavedPatent


class Saver(DatabaseCall):
    def __init__(self):
        super().__init__()

    def savePatent(self, userID: str, patentData: PatentData):
        """Save the patent object to the database."""
        newPatent = SavedPatent(
            user_id=userID,
            patent_data=patentData.model_dump(),
        )
        self.createAndCommit([newPatent])

        pass

    def queryPatents(self, userID: str):
        """Query the database for all patents saved by the user."""
        patents = self.session.query(SavedPatent).filter_by(user_id=userID).all()
        return [patent.patent_data for patent in patents]
