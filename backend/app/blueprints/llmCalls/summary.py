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

            # only scrape the claims + abstract for the summary
            self.sections = ["claims", "abstract"]

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
            I am going to give you the claims and abstract section of a patent. I want you to summarize what the patent is and the key features of it in between 400 and 500 words.

            I want you to make sure you include all of the independent claims in the summary. Below are the claims and abstract sections:

            Claims:
                {scrapedData[0]}

            Abstract:
                {scrapedData[1]}

            I want you to output your response in JSON format like this:
            ```json
            {{
                "summary": "your summary goes here"
            }}
        ```
        """

        # args for invoking the chain
        invokeArgs = {}

        # invoke the request, return the result
        return self.makeRequest(template, SummaryExtraction, invokeArgs)