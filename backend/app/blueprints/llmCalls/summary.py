from .llmRequests import LlmRequests
from .schemas import SummaryInput, SummaryExtraction

class Summary(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedInput = SummaryInput(**data)

            # set the variables
            self.user = validatedInput.user
            self.patentURL = validatedInput.patentURL

            # only need to scrape the claims sections for this request
            # TODO: determine which sections we really need for the summary
            self.sections = ["claims", "abstract", "description"]

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")
    
    def handleRequest(self):
        # scrape the claims section
        scrapedData = self.scrapePatent(self.sections, self.patentURL)

        # TODO: implement the template
        template = f"""
        
        """

        # args for invoking the chain
        invokeArgs = {"searchQuery": self.searchQuery}

        # invoke the request, return the result
        return self.makeRequest(template, SummaryExtraction, invokeArgs)