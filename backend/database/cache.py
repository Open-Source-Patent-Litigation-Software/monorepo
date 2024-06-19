from sqlalchemy.orm import Session
from .models import Search, Metric, SpecificPatentMetric, Patent

class Cache:
    def __init__(self, session: Session):
        self.session = session