from sqlalchemy.orm import Session
# from .models import Search, Metric, SpecificPatentMetric, Patent
from .databaseCall import DatabaseCall


class Cache(DatabaseCall):
    """Caching refers to storing metrics, prior searches, and citations in a cache."""

    def __init__(self):
        super().__init__()

    # def saveSearch(self, organizationID: int, userId: int, searchQuery: str) -> None:
    #     """Save the search object to the database."""

    #     search = Search(
    #         organization_id=organizationID, user_id=userId, query=searchQuery
    #     )
    #     self.createAndCommit([search])
    #     self.logger(f"Search '${searchQuery}' saved to the database.")

    # def saveMetrics(self, searchID: int, metric: list) -> None:
    #     """Save the metric object to the database."""
    #     for m in metric:
    #         metric = Metric(search_id=searchID, metric=m)
    #         self.createAndCommit([metric])
    #     self.logger.info(f"Metrics saved for search ID: {searchID}")

    # def saveSpecificPatentMetric(
    #     self, searchID: int, patentID: int, metricID: int, percentage: int, information
    # ) -> None:
    #     """Save the specific patent metric object to the database."""
    #     specificPatentMetric = SpecificPatentMetric(
    #         search_id=searchID,
    #         patent_id=patentID,
    #         metric_id=metricID,
    #         percentage=percentage,
    #         information=information,
    #     )
    #     self.createAndCommit([specificPatentMetric])
    #     self.logger.info(f"Specific patent metric saved for search ID: {searchID}")
