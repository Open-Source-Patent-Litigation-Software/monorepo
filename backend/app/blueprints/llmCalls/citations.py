from .llmRequests import LlmRequests
from .schemas import CitationsInput
from .schemas import Section

class Citations(LlmRequests):
    def __init__(self, data: dict):
        try:
            # validate the JSON data recieved from the client
            validatedData = CitationsInput(**data)

            # set the variables
            self.metric = validatedData.metric_str
            self.url = validatedData.patentURL
            self.user = validatedData.user

            self.sections = ["claims", "abstract", "description"]

            # initialize the parent class
            super().__init__()
        except ValueError as e:
            # handle validation erros
            raise ValueError(f"Invalid input: {e}")

    # This function handles the LLM request, returning the validated output
    def handleRequest(self):
        # get the claims, abstract and description section. This will be a list of the three section in order.
        scrapedData = self.scrapePatent(self.sections, self.url)

        # template for the GPT request, 
        template = f"""
        Your job is take three sections - claims, abstract and description - and a single metric (or function) and find quotes from within those sections that relate to the metric.
        There are three portions you need to extract: a before, highlighted and after.
        
        The most important section is the highlighted, which should be the text that relates to the metric provided.
        Before should be 1-2 sentences before the highlighted portion.
        After should be 1-2 senteces after the highlighted portion.

        Before, highlighted and after should not be same. None of the three strings can be empty.
        
        So I will give you the three sections and the metric, and you will need to give me the relevant sections.

        The flow will look like this:
        I will give you the metric then I will give you each of the three sections. For example this is a metric:

            metric = "Brews hot beverage."

        Next I will give you each of the three sections. Here are examples of what these sections will look like.
        
        The claims section of one of the example patents looks like this:
        claims section:
            1. A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit; and an outlet channel for coffee which is connected to the container, wherein the coffee supply channel and the outlet channel for coffee both connect to the container at a bottom side of the container, wherein the coffee supply channel that connects to the container extends upwardly inside the container up to a highest level, wherein at said highest level an air relief chamber is provided to release air from the coffee transported through the coffee supply channel, and that from the air relief chamber a coffee mix channel extends downwardly to above and near to the bottom of the container.
            2. The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.
            3. The coffee dispenser system of claim 1, wherein the container comprises a thermos bottle provided with a screw connection to a bottom plate that closes off the thermos bottle.
            4. The coffee dispenser system of claim 1, wherein the container does not comprise heating facilities.
            5. The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container.
            6. The coffee dispenser system of claim 1, wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container.
            7. The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level.
        
        The abstract section of one of the example patents looks like this:
        abstract section:
            The present invention relates to a coffee machine designed to optimize brewing efficiency and enhance the user experience. This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing. The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos. Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance. This design aims to deliver a superior cup of coffee while offering convenience and versatility for the user.

        The description section of one of the example patents looks like this:
        descriptions section:
            The present invention relates to the field of beverage preparation appliances, specifically to an automated coffee machine designed to brew high-quality coffee beverages with enhanced user convenience and customization.
            Traditional coffee machines often require multiple steps and separate appliances for grinding beans, brewing coffee, and frothing milk, which can be time-consuming and cumbersome. Existing machines with integrated functions may lack user-friendly interfaces and customizable settings, resulting in inconsistent coffee quality and user dissatisfaction. The present invention addresses these issues by providing a comprehensive solution that combines multiple functions into a single, easy-to-use device.
            The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently. The machine features a touch screen interface for ease of use, programmable settings for customization, and a self-cleaning mechanism for minimal maintenance. The primary objective is to offer a user-friendly, versatile coffee machine that delivers consistent, high-quality coffee beverages.
            The coffee machine comprises the following key components: an integrated burr grinder located at the top of the machine, capable of grinding coffee beans to the desired fineness. The grinder features adjustable settings to cater to different brewing preferences. Positioned below the grinder, the brewing chamber receives ground coffee and hot water for the brewing process. It includes a removable filter basket for easy cleaning and maintenance. A built-in milk frother adjacent to the brewing chamber, capable of frothing milk to the desired consistency. The frother includes a steam wand and a dedicated milk container. Located on the front panel of the machine, the touch screen interface allows users to select beverage types, customize brew strength and volume, and initiate the self-cleaning process.
            Users load coffee beans into the hopper, select the desired grind size and brew strength via the touch screen interface. The grinder automatically grinds the beans, and the ground coffee is transferred to the brewing chamber. Hot water is then pumped into the brewing chamber, where it extracts the coffee, which is dispensed into the user's cup. Users can select the froth option on the touch screen interface. The milk frother draws milk from the container, froths it using the steam wand, and dispenses it into the cup.
            The touch screen interface allows users to save preferred settings for grind size, brew strength, and beverage volume. The machine can store multiple user profiles, each with customized settings for different types of coffee beverages. The machine includes a self-cleaning function that can be initiated via the touch screen interface. The cleaning process involves flushing the grinder, brewing chamber, and milk frother with hot water and steam, ensuring hygiene and reducing manual cleaning efforts.
            The coffee machine offers several advantages over traditional models, including: integrated functionality that combines grinding, brewing, and frothing in one device.

        This is what the output should look like for this example in JSON format. The only output you should give is this JSON format.
        ```json
        {{
            "claims": [
                {{
                    "before": "A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit; and an outlet channel for coffee which is connected to the container.",
                    "highlight": "wherein the coffee supply channel and the outlet channel for coffee both connect to the container at a bottom side of the container.",
                    "after": "wherein the coffee supply channel that connects to the container extends upwardly inside the container up to a highest level."
                }},
                {{
                    "before": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.",
                    "highlight": "wherein the container comprises a thermos bottle provided with a screw connection to a bottom plate that closes off the thermos bottle.",
                    "after": "wherein the container does not comprise heating facilities."
                }},
                {{
                    "before": "The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container.",
                    "highlight": "wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container.",
                    "after": "wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level."
                }}
            ],
            "abstract": [
                {{
                    "before": "The present invention relates to a coffee machine designed to optimize brewing efficiency and enhance the user experience.",
                    "highlight": "This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing.",
                    "after": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos."
                }},
                {{
                    "before": "Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance.",
                    "highlight": "This design aims to deliver a superior cup of coffee while offering convenience and versatility for the user.",
                    "after": "The innovative features and user-friendly design make this coffee machine a valuable addition to any kitchen."
                }}
            ],
            "description": [
                {{
                    "before": "Traditional coffee machines often require multiple steps and separate appliances for grinding beans, brewing coffee, and frothing milk, which can be time-consuming and cumbersome.",
                    "highlight": "Existing machines with integrated functions may lack user-friendly interfaces and customizable settings, resulting in inconsistent coffee quality and user dissatisfaction.",
                    "after": "The present invention addresses these issues by providing a comprehensive solution that combines multiple functions into a single, easy-to-use device."
                }},
                {{
                    "before": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently.",
                    "highlight": "The machine features a touch screen interface for ease of use, programmable settings for customization, and a self-cleaning mechanism for minimal maintenance.",
                    "after": "The primary objective is to offer a user-friendly, versatile coffee machine that delivers consistent, high-quality coffee beverages."
                }},
                {{
                    "before": "Users load coffee beans into the hopper, select the desired grind size and brew strength via the touch screen interface.",
                    "highlight": "The grinder automatically grinds the beans, and the ground coffee is transferred to the brewing chamber.",
                    "after": "Hot water is then pumped into the brewing chamber, where it extracts the coffee, which is dispensed into the user's cup."
                }}
            ]
        }}
        ```

        You should use this format for a metric, outputting 2-3 before, highlight and after sections per section (abstract, claims and description). It is incredibly important that Claims, Abstract and Description have at least 1 highlighted section each.

        Now that you understand the flow. I will give you 1 metric and each of the three sections - abstract, claims and description. You should find 2-3 clusters in each section for the metric provided. If a sections is missing, you should ignore it and output that field as an empty list.

        Metric: {self.metric}
        Claims Section: {scrapedData[0]}
        Abstract Section: {scrapedData[1]}
        Description: {scrapedData[2]}

        The only output you should give is in the format provided and should be valid JSON format.
        """

        # invoke the request and return the result
        return self.makeRequest(template, Section)