from abc import abstractmethod

class LlmRequests:
    def __init__():
        pass

    def makeRequest(self):
        # actually make the request:
        print("making the GPT Request")

    @abstractmethod
    def getData():
        # this would be where we would scrape the data
        pass

    @abstractmethod
    def prepareRequest():
        # prepare the information for the GPT request:
        pass