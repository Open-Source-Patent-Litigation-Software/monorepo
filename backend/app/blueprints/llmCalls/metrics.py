from .llmRequests import LlmRequests
from .schemas import MetricInput, MetricExtraction


class Metrics(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedInput = MetricInput(**data)

            # set the variables
            self.searchQuery = validatedInput.searchQuery
            self.user = validatedInput.user

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")

    def handleRequest(self):
        # template for the request
        template = f"""
        Your job is to take a search query and extract 8 functions from it, which are then put into this format.
            ```json
                {{
                    "functions": [
                        "Function 1",
                        "Function 2",
                        "Function 3",
                        "Function 4",
                        "Function 5",
                        "Function 6",
                        "Function 7",
                        "Function 8"
                    ]
                }}
            ```
            

        Let me give you an example. Let's say the search query is:
        
            A coffee maker that dispenses both milk and coffee. The coffee can be made either from
        beans or from pods. To prevent spilling, there is a metal or plastic grate at the bottom.
        There is an electric screen to control it and alert the user once it's done.

            The functions you can extract from this are:
            Brews hot beverage.
            Dispenses milk.
            Can use coffee pods.
            Can use coffee beans.
            Has refillable water reservoir.
            Has grate to prevent spillage.
            Has electric screen for use.
            Alerts user when done.

        I want you to output this as a list of strings. So for this example it should look like this:
        ```json
            {{
                "functions": [
                    "Brews hot beverage.",
                "Dispenses milk.",
                "Can use coffee pods.",
                "Can use coffee beans.",
                "Has refillable water reservoir.",
                "Has grate to prevent spillage.",
                "Has electric screen for use.",
                "Alerts user when done."
                ]
            }}
        ```
 
        Now, given the search query below, you must extract 8 functions from it.
        It is very important that you extract exactly 8 functions accurately and in the correct format.
        Do not make up anything that is not in the search query.
        I NEED EXACTLY 8 FUNCTIONS. NO MORE, NO LESS.
        
        {self.searchQuery}
        """
        # these are the invoke args.
        invokeArgs = {"searchQuery": self.searchQuery}

        return self.makeRequest(template, MetricExtraction, invokeArgs)
