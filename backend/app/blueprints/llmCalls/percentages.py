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
        
            query = "A coffee maker that brews coffee as well as milk, has a timer, a temperature sensor, an electronic screen to control it, and a beeper that alerts the user when the product is done."

            functions = 
                [
                    "Brews coffee.",
                    "Brews milk.",
                    "Has timer function.",
                    "Has a temperature sensor.",
                    "Has an electronic screen for control.",
                    "Has beeper to alert user when done."
                ]

        Now for this query above many patents will appear as results for what this client is looking for.

        Here is an example of such a patent's claims section which we will use to extract percentages.
        You will need to extract the percentage of each function from the search using information from the claims section for the patent.

        The claims section of one of the example patents looks like this:
        claims section:
            1. A coffee brewing system comprising:
                a brew chamber that holds a brew solution during a brew cycle and dispenses the brew solution;
                a water system that is integrated to dispense water into the brew chamber;
                a content sensing system that measures the brew solution contents added to the brew chamber;
                a temperature control system with a heating element and a temperature sensor, wherein the heating element of the temperature control system directly heats liquid in the water system;
                at least one recirculating processing loop with a particle monitor system, wherein the recirculating processing loop circulates brew solution extracted from the brew chamber, wherein the recirculating processing loop comprises a subsection that is thermally coupled to the water system such that the heating element indirectly heats brew solution circulated through the processing loop; and
                a control system that is communicatively coupled to the content sensing system, the temperature control system and the particle monitor system during a brew cycle, wherein the control system controls a brew cycle based on a selected a specified taste profile.
            2. The system of claim 1, wherein the specified taste profile is selected from a set of taste profiles with each taste profile associated with a distinct user.
            3. The system of claim 1, further comprising a user application that collects user feedback on dispensed coffee, wherein the user feedback is used in part to augment a brew process configuration of a second brew cycle of the coffee maker.
            4. The system of claim 3, wherein the user feedback is used in combination with a selected bean type to determine the brew process configuration used by the control system during the second brew cycle.
            5. The system of claim 1, further comprising a set of manual controls that define the taste profile settings referenced by the control system.
            6. The system of claim 1, further comprising a coffee grinding system with a grind outlet positioned to deliver coffee grounds to the brew chamber, wherein the grind size and quantity of produced coffee grounds is controlled by the control system.
            7. The system of claim 1, wherein the control system includes a calibration mode, wherein the heating effect of the temperature control system is calibrated and accounted for in directing control of the temperature control system.
            8. The system of claim 1, further comprising a tasting flight system that can be removably added to a brew chamber while the control system operates in a tasting flight mode; wherein the tasting flight system comprises at least a chamber divider segmenting the brew chamber into multiple sub-chambers and a chamber selection system through which the control system can individually control the brew cycle of each sub-chamber.
            9. A coffee brewing system comprising:
                a brew chamber that holds a brew solution during a brew cycle and dispenses the brew solution;
                a water system is integrated to dispense water into the brew chamber;
                a content sensing system that measures the brew solution contents added to the brew chamber;
                a temperature control system with a heating element and a temperature sensor;
                at least one recirculating processing loop with a particle monitor system, wherein the recirculating processing loop circulates brew solution extracted from the brew chamber;
                a control system that is communicatively coupled to the content sensing system, the temperature control system and the particle monitor system during a brew cycle, wherein the control system controls a brew cycle based on a selected a specified taste profile; and
                a tasting flight system that can be removably added to a brew chamber while the control system operates in a tasting flight mode, the tasting flight system comprising: a chamber divider segmenting the brew chamber into multiple sub-chambers and a chamber selection system through which the control system can individually control the brew cycle of each sub-chamber.
            10. The system of claim 9, wherein the specified taste profile is selected from a set of taste profiles with each taste profile associated with a distinct user.
            11. The system of claim 9, further comprising a user application that collects user feedback on dispensed coffee, wherein the user feedback is used in part to augment a brew process configuration of a second brew cycle of the coffee maker.
            12. The system of claim 11, wherein the user feedback is used in combination with a selected bean type to determine the brew process configuration used by the control system during the second brew cycle.
            13. The system of claim 9, further comprising a set of manual controls that define the taste profile settings referenced by the control system.
            14. The system of claim 9, further comprising a coffee grinding system with a grind outlet positioned to deliver coffee grounds to the brew chamber, wherein the grind size and quantity of produced coffee grounds is controlled by the control system.
            15. The system of claim 9, wherein the heating element of the temperature control system directly heats liquid in the water system; and wherein the processing loop comprises a subsection that is thermally coupled to the water system such that the heating element indirectly heats brew solution circulated through the processing loop.
            16. The system of claim 9, wherein the control system includes a calibration mode, wherein the heating effect of the temperature control system is calibrated and accounted for in directing control of the temperature control system.
        In this case, the output should be in the following JSON format:
        ```json
        {{
        "data": {{
            "Brews coffee.": 100%,
            "Brews milk.": 0%,
            "Has timer function.": 40%,
            "Has a temperature sensor.": 100%,
            "Has an electronic screen for control.": 60%,
            "Has beeper to alert user when done.": 0%
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