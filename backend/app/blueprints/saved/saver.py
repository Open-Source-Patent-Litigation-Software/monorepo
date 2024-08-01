from database.databaseCall import DatabaseCall
from .schema import PatentData
from database.models import SavedPatent
from sqlalchemy.orm.exc import NoResultFound


class Saver(DatabaseCall):

    def __init__(self):
        super().__init__()

    def savePatent(self, userID: str, patentData):
        """Save the patent object to the database."""
        patent_id = patentData["patentInfo"]["publication_id"]
        newPatent = SavedPatent(
            user_id=userID,
            patent_id=patent_id,
            patent_data=patentData,
        )
        self.createAndCommit([newPatent])

        pass

    def queryPatents(self, userID: str):
        """Query the database for all patents saved by the user."""
        patents = self.session.query(SavedPatent).filter_by(user_id=userID).all()
        patent_list = []
        for patent in patents:
            patent_dict = {
                "neon_patent_id": patent.id,
                "citations": patent.patent_data.get("citations", {}),
                "patentInfo": patent.patent_data.get("patentInfo", {}),
                "percentages": patent.patent_data.get("percentages", {}),
                "search": patent.patent_data.get("search", ""),
                "summary": patent.patent_data.get("summary", ""),
                "dateSaved": patent.saved_on.strftime("%Y-%m-%d %H:%M:%S"),
            }
            patent_list.append(patent_dict)
        return patent_list

    def deletePatent(self, userID: str, patentID: str):
        """Delete a patent from the database."""
        try:
            patent = (
                self.session.query(SavedPatent)
                .filter_by(user_id=userID, patent_id=patentID)
                .one()
            )

            self.session.delete(patent)
            self.session.commit()
            return True  # Indicate successful deletion
        except NoResultFound:
            # If no patent is found with the given userID and patentID
            return False  # Indicate that no patent was found to delete
        except Exception as e:
            # Handle any other exceptions that might occur
            self.session.rollback()
            print(f"An error occurred while deleting the patent: {str(e)}")
            return False  # Indicate that deletion failed
