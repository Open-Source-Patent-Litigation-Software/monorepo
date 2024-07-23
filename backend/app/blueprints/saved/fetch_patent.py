from database.databaseCall import DatabaseCall
from database.models import SavedPatent
from sqlalchemy.orm.exc import NoResultFound


class FetchPatent(DatabaseCall):

    def __init__(self):
        """Initialize the Fetch_Patent class."""
        super().__init__()

    def fetchPatent(self, patentID: str) -> dict | None:
        """Fetch a patent from the database."""
        try:
            patent = self.session.query(SavedPatent).filter_by(patent_id=patentID).one()
            return patent.patent_data
        except NoResultFound:
            return None
        except Exception as e:
            self.session.rollback()
            print(f"An error occurred while fetching the patent: {str(e)}")
            return None
