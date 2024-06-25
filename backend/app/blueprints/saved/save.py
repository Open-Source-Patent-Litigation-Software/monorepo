from .schema import PatentData
from database.databaseCall import DatabaseCall


class PatentSaver:
    def __init__(self, data: PatentData):
        self.data = data

    def savePatent(self):
        # UNIQUE KEYS: username
        DB_Instance = DatabaseCall()
        # Initialize the patent data as a json object
        # Get the time (postgres might do this)
        # Get the username

        # Create the patent object
        # Save the patent object
        pass

    def getPatent(self):
        # UNIQUE KEYS: username,
        pass
