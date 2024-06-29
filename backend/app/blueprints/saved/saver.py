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
            patent_id=patentData.patentInfo.id,
            patent_data=patentData.model_dump(),
        )
        self.createAndCommit([newPatent])

        pass

    def queryPatents(self, userID: str):
        """Query the database for all patents saved by the user."""
        patents = self.session.query(SavedPatent).filter_by(user_id=userID).all()
        patent_list = []
        for patent in patents:
            patent_dict = {
                "citations": patent.patent_data.get("citations", {}),
                "patentInfo": patent.patent_data.get("patentInfo", {}),
                "percentages": patent.patent_data.get("percentages", {}),
                "search": patent.patent_data.get("search", ""),
                "summary": patent.patent_data.get("summary", ""),
            }
            patent_list.append(patent_dict)
        return patent_list
