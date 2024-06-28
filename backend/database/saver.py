from .databaseCall import DatabaseCall

class Saver(DatabaseCall):
    def __init__(self):
        super().__init__()
    
    def savePatent(self, patentData: dict):
        """Save the patent object to the database."""
        pass