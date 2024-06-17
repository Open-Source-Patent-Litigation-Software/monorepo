from .llmRequests import LlmRequests
from .schemas import PercentagesInput, PercentExtraction

class Percentages(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedInput = PercentagesInput(**data)

            # set the variables
            self.searchQuery = validatedInput.searchQuery
            self.user = validatedInput.user
            self.patentURL = validatedInput.patentURL
            self.metrics = validatedInput.metrics

            # only need to scrape the claims sections for this request
            self.sections = ["claims"]

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")
    
    def handleRequest(self):
        # scrape the claims section
        scrapedData = self.scrapePatent(self.sections, self.patentURL)

        # split the metrics str into a list of metrics
        metricsList = [metric.strip() for metric in self.metrics.split("%_")]

        # 
        template = f"""
        Your job is to take a search query and its associated metrics (aka functions) and extract the percentage of each metric using a patent's claims section.

        So I will give you a query and its metrics, and you will need to extract the percentage of each metric in the patent claims.

        The flow will look like this:
        I give you a search query and the 8 functions extracted from it. For example, this is a query and its functions:
        
            query = "A coffee maker that dispenses both milk and coffee. The coffee can be made either from
            beans or from pods. To prevent spilling, there is a metal or plastic grate at the bottom.
            There is an electric screen to control it and alert the user once it's done."
            
            functions = 
                [
                    "Brews hot beverage.",
                    "Dispenses milk.",
                    "Can use coffee pods.",
                    "Can use coffee beans.",
                    "Has refillable water reservoir.",
                    "Has grate to prevent spillage.",
                    "Has electric screen for use.",
                    "Alerts user when done."
                ]

        Now for this query above many patents will appear as results for what this client is looking for.

        Here is an example of such a patent's claims section which we will use to extract percentages.
        You will need to extract the percentage of each function from the search using information from the claims section for the patent.

        The claims section of one of the example patents looks like this:
        claims section:
            1. A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit; and an outlet channel for coffee which is connected to the container, wherein the coffee supply channel and the outlet channel for coffee both connect to the container at a bottom side of the container, wherein the coffee supply channel that connects to the container extends upwardly inside the container up to a highest level, wherein at said highest level an air relief chamber is provided to release air from the coffee transported through the coffee supply channel, and that from the air relief chamber a coffee mix channel extends downwardly to above and near to the bottom of the container.
            2. The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.
            3. The coffee dispenser system of claim 1, wherein the container comprises a thermos bottle provided with a screw connection to a bottom plate that closes off the thermos bottle.
            4. The coffee dispenser system of claim 1, wherein the container does not comprise heating facilities.
            5. The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container.
            6. The coffee dispenser system of claim 1, wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container.
            7. The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level.
        
        In this case, the output should be in the following JSON format:
        ```json
        {{
        "data": {{
            "Brews hot beverage.": 0.9,
            "Dispenses milk.": 0.5,
            "Can use coffee pods.": 0.3,
            "Can use coffee beans.": 0.4,
            "Has refillable water reservoir.": 0.8,
            "Has grate to prevent spillage.": 0.2,
            "Has electric screen for use.": 0.3,
            "Alerts user when done.": 0.6
        }},
        }}
        ```

        Now that you understand the flow, I will give you the search query, the user, and the patent ID. You will need to extract the percentage of each function in the claims section.
        Search Query: {self.searchQuery}
        Metrics: {metricsList}
        Claims Section: {scrapedData[0]}

        Try to make the percentages reasonably accurate. Just estimate it. If it is a related topic, but not directly mentioned, give a lower percentage, somewhere like 0.1-0.3. If it is directly mentioned, give a higher percentage.
        Output the result in the exact JSON format as shown above, with the metrics represented as the actual function names, and their percentages filled in accordingly. Do not include any extra text or explanation, just the JSON.
        """

        # args for invoking the chain
        invokeArgs = {"searchQuery": self.searchQuery}

        # invoke the request, return the result
        return self.makeRequest(template, PercentExtraction, invokeArgs)