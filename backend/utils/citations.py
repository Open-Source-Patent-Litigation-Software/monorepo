import os
import json
from typing import List, Dict, Optional
from dotenv import load_dotenv
from flask import jsonify
import requests
from langchain_core.pydantic_v1 import BaseModel, root_validator, validator
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from utils.scraping import scrapeAbstract, scrapeClaims, scrapeDescription

load_dotenv()
OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY")

class ParagraphModel(BaseModel):
    paragraph: str
    highlight: str

class SectionModel(BaseModel):
    claims: List[ParagraphModel]
    description: List[ParagraphModel]
    abstract: List[ParagraphModel]

class PatentModel(BaseModel):
    __root__: Dict[str, SectionModel]

    # @root_validator(pre=True)
    # def check_data(cls, values):
    #     exact_length = values.get('expected_length')
    #     if exact_length is not None:
    #         data = values.get('data')
    #         if len(data) != exact_length:
    #             raise ValueError(f"The data object must have exactly {exact_length} key-value pairs.")
    #     return values

def extractCitations(
    user: str,
    patentURL: str,
    metrics: str,
    model: str = "gpt-3.5-turbo",
) -> Dict:
    # scrape the claims 
    claims = scrapeClaims(patentURL)
    abstract = scrapeAbstract(patentURL)
    description = scrapeDescription(patentURL)

    # check / clean claims + abstract + description
    # TODO:

    # extract metrics from the concatinated string
    metricsList = [metric.strip() for metric in metrics.split('%_')]

    # if we cant find claims, abstract or description, return
    if not claims and not abstract and not description:
        raise ValueError("Claims, Abstract and Description no found or failed to scrape.")

    # join each section together
    claims_text = ""
    if claims:
        claims_text = "\n".join(claims)
    
    abstract_text = ""
    if abstract:
        abstract_text = "\n".join(abstract)
    
    description_text = ""
    if description:
        description_text = "\n".join(description)

    # template for GPT request
    highlightedSentencesTemplate = f"""
    Your job is to take three sections - claims, abstract and description - and a list of 6 - 10 metrics and extract the sections relevant to each metric from each section.
    There are two parts of these relevant sections: a highlighted portion and a context portion. 
    
    The highlighted portion should be the relevant section. 
    
    The context should be surrounding text of the highlighted portion, 1-2 sentences before and after the highlighted portion. The highlighted portion should be included in the context. You should only add this if you feel that the relevant poriton needs this context to make sense.

    So I will give you the three sections and the metrics, and you will need to give me the relevant sections for each metric in each section as described above. I want you to find at least 1 relevant section per metric.

    Each of the three sections - abstract, claims and description - will be strings with varying lengths. If one of these sections is empty, it is safe to ignore it.

    The flow will look like this:
    I will give you the 6 - 10 metrics then I will give you each of the three sections. For example, these are the metrics:

        metrics = 
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
    "Brews hot beverage.": {{
        "claims": [
            {{
                "paragraph": "A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit; and an outlet channel for coffee which is connected to the container, wherein the coffee supply channel and the outlet channel for coffee both connect to the container at a bottom side of the container.",
                "highlight": "A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "The present invention relates to a coffee machine designed to optimize brewing efficiency and enhance the user experience. This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing.",
                "highlight": "This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing."
            }}
        ],
        "description": [
            {{
                "paragraph": "The present invention relates to the field of beverage preparation appliances, specifically to an automated coffee machine designed to brew high-quality coffee beverages with enhanced user convenience and customization.",
                "highlight": "The present invention relates to the field of beverage preparation appliances, specifically to an automated coffee machine designed to brew high-quality coffee beverages with enhanced user convenience and customization."
            }},
            {{
                "paragraph": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently.",
                "highlight": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently."
            }}
        ]
    }},
    "Dispenses milk.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 6, wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container.",
                "highlight": "The coffee dispenser system of claim 6, wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos.",
                "highlight": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos."
            }}
        ],
        "description": [
            {{
                "paragraph": "A built-in milk frother adjacent to the brewing chamber, capable of frothing milk to the desired consistency. The frother includes a steam wand and a dedicated milk container.",
                "highlight": "A built-in milk frother adjacent to the brewing chamber, capable of frothing milk to the desired consistency. The frother includes a steam wand and a dedicated milk container."
            }},
            {{
                "paragraph": "Users load coffee beans into the hopper, select the desired grind size and brew strength via the touch screen interface. The grinder automatically grinds the beans, and the ground coffee is transferred to the brewing chamber. Hot water is then pumped into the brewing chamber, where it extracts the coffee, which is dispensed into the user's cup. Users can select the froth option on the touch screen interface. The milk frother draws milk from the container, froths it using the steam wand, and dispenses it into the cup. The touch screen interface allows users to save preferred settings for grind size, brew strength, and beverage volume.",
                "highlight": "Users can select the froth option on the touch screen interface. The milk frother draws milk from the container, froths it using the steam wand, and dispenses it into the cup."
            }}
        ]
    }},
    "Can use coffee pods.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.",
                "highlight": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing. The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos.",
                "highlight": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos."
            }}
        ],
        "description": [
            {{
                "paragraph": "Users load coffee beans into the hopper, select the desired grind size and brew strength via the touch screen interface. The grinder automatically grinds the beans, and the ground coffee is transferred to the brewing chamber. Hot water is then pumped into the brewing chamber, where it extracts the coffee, which is dispensed into the user's cup.",
                "highlight": "Users load coffee beans into the hopper, select the desired grind size and brew strength via the touch screen interface. The grinder automatically grinds the beans, and the ground coffee is transferred to the brewing chamber."
            }}
        ]
    }},
    "Can use coffee beans.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.",
                "highlight": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing.",
                "highlight": "This innovative coffee machine features an integrated grinder and brewing system, allowing users to grind fresh coffee beans immediately before brewing."
            }}
        ],
        "description": [
            {{
                "paragraph": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently.",
                "highlight": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently."
            }}
        ]
    }},
    "Has refillable water reservoir.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container.",
                "highlight": "The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance.",
                "highlight": "Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance."
            }}
        ],
        "description": [
            {{
                "paragraph": "The machine includes a self-cleaning function that can be initiated via the touch screen interface. The cleaning process involves flushing the grinder, brewing chamber, and milk frother with hot water and steam, ensuring hygiene and reducing manual cleaning efforts.",
                "highlight": "The machine includes a self-cleaning function that can be initiated via the touch screen interface. The cleaning process involves flushing the grinder, brewing chamber, and milk frother with hot water and steam, ensuring hygiene and reducing manual cleaning efforts."
            }}
        ]
    }},
    "Has grate to prevent spillage.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.",
                "highlight": "The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties."
            }}
        ],
        "abstract": [],
        "description": [
            {{
                "paragraph": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently.",
                "highlight": "The coffee machine described herein integrates a grinder, brewer, and milk frother into one appliance, allowing users to prepare a variety of coffee beverages quickly and efficiently."
            }}
        ]
    }},
    "Has electric screen for use.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level.",
                "highlight": "The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos.",
                "highlight": "The machine includes an intuitive touch screen interface for easy operation, programmable settings for customizing brew strength and volume, and a built-in milk frother for creating various coffee beverages such as lattes and cappuccinos."
            }}
        ],
        "description": [
            {{
                "paragraph": "The machine features a touch screen interface for ease of use, programmable settings for customization, and a self-cleaning mechanism for minimal maintenance.",
                "highlight": "The machine features a touch screen interface for ease of use, programmable settings for customization, and a self-cleaning mechanism for minimal maintenance."
            }}
        ]
    }},
    "Alerts user when done.": {{
        "claims": [
            {{
                "paragraph": "The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level.",
                "highlight": "The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level."
            }}
        ],
        "abstract": [
            {{
                "paragraph": "Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance.",
                "highlight": "Additionally, the coffee machine incorporates a self-cleaning mechanism to ensure hygiene and minimize maintenance."
            }}
        ],
        "description": [
            {{
                "paragraph": "The machine includes a self-cleaning function that can be initiated via the touch screen interface. The cleaning process involves flushing the grinder, brewing chamber, and milk frother with hot water and steam, ensuring hygiene and reducing manual cleaning efforts.",
                "highlight": "The machine includes a self-cleaning function that can be initiated via the touch screen interface. The cleaning process involves flushing the grinder, brewing chamber, and milk frother with hot water and steam, ensuring hygiene and reducing manual cleaning efforts."
            }}
        ]
    }}
    }}

    ```

    You should use the following format for each of the metrics provided, finding three to five of the most relevant sections for each metric from any combination of the three sections.

    You should include surrounding context of the sentence to highlight to help the reader better understand why the sentence is highlighted.
    To do this you should include one to two sentences both before and after the highlighted section. The format you should follow is putting the entire chosen section in the paragraph portion and then the important section you chose as the highlighted in the JSON format.

    Now that you understand the flow, I will give you the metrics, claims Section, abstract section and description. You will need to extract the important sentences from each section.

    Make sure to include each metric I provide in your output, with at least 1 highlighted text for each section for every metric. If i give you 8 metrics, you should return 8 metrics. Additionally, each metric should have at least 1 selected section per claims, abstract and description.
    Metrics: {metricsList}
    Claims Section: {claims_text}
    Abstract Section: {abstract_text}
    Description: {description_text}

    The only output you should give is in this JSON format, with the sections described. It is very important that the output is valid JSON data. If there is a mistake in the JSON of the example, ignore it, and ensure your output is valid JSON fromat.
    """

    # Initialize the ChatOpenAI client with the provided API key and model
    llm = ChatOpenAI(model=model, temperature=1, api_key=OPEN_AI_KEY)

    # Create a ChatPromptTemplate object
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=highlightedSentencesTemplate),
        ]
    )

    # Combine the prompt with the model
    chain = prompt | llm

    # Set up a parser to ensure the output conforms to the Pydantic model
    parser = PydanticOutputParser(pydantic_object=PatentModel)

    # Extract and return the percentages
    result = chain.invoke({"metrics": metricsList})

    try:
        # Parse the JSON output
        parsed_result = parser.parse(result.content)

    except Exception as e:
        raise ValueError(f"Failed to parse JSON from completion: {e}")

    # Convert the parsed result to a dictionary
    result_dict = parsed_result.dict()["__root__"]


    # TODO: talk to dev about what to do with this
    print(len(result_dict))

    # Return the result as a Flask JSON object
    return jsonify(result_dict)

class Quote(BaseModel):
    before: Optional[str]
    highlight: str
    after: Optional[str]

    @validator('before', 'after')
    def check_length(cls, v):
        # if v is not None and len(v.split()) > 50:
        #     raise ValueError('Context must be at most 50 words')
        return v


class Section(BaseModel):
    claims: List[Quote]
    abstract: List[Quote]
    description: List[Quote]

def extractCitaionsSingleMetric(
    user: str,
    patentURL: str,
    metric: str,
    model: str = "gpt-3.5-turbo",
) -> Dict:
    # scrape the claims 
    claims = scrapeClaims(patentURL)
    abstract = scrapeAbstract(patentURL)
    description = scrapeDescription(patentURL)

    # if we cant find claims, abstract or description, return
    if not claims and not abstract and not description:
        raise ValueError("Claims, Abstract and Description no found or failed to scrape.")

    # join each section together
    claims_text = ""
    if claims:
        claims_text = "\n".join(claims)
    
    abstract_text = ""
    if abstract:
        abstract_text = "\n".join(abstract)
    
    description_text = ""
    if description:
        description_text = "\n".join(description)

    # template for GPT request
    highlightedSentencesTemplate = f"""
    Your job is take three sections - claims, abstract and description - and a single metric (or function) and find quotes from within those sections that relate to the metric.
    There are three portions you need to extract: a before, highlighted and after.
    
    The most important section is the highlighted, which should be the text that relates to the metric provided.
    Before should be 1-2 sentences before the highlighted portion. Before can be empty is the paragraph starts with the highlighted poriton.
    After should be 1-2 senteces after the highlighted portion. Empty can be empty if the paragraph ends with the highlighted portion.

    Before, highlighted and after should not be same. Both before and after cannot be empty strings.
    
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

    You should use this format for a metric, outputting 2-3 per section.

    Now that you understand the flow, I will give you the metrics, claims Section, abstract section and description. You will need to extract the important sentences from each section.

    Make sure to include each metric I provide in your output, with at least 1 highlighted text for each section for every metric. If i give you 8 metrics, you should return 8 metrics. Additionally, each metric should have at least 1 selected section per claims, abstract and description.
    Metrics: {metric}
    Claims Section: {claims_text}
    Abstract Section: {abstract_text}
    Description: {description_text}

    The only output you should give is in this JSON format, with the sections described. It is very important that the output is valid JSON data. If there is a mistake in the JSON of the example, ignore it, and ensure your output is valid JSON fromat.
    """

    # Initialize the ChatOpenAI client with the provided API key and model
    llm = ChatOpenAI(model=model, temperature=1, api_key=OPEN_AI_KEY)

    # Create a ChatPromptTemplate object
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=highlightedSentencesTemplate),
        ]
    )

    # Combine the prompt with the model
    chain = prompt | llm

    # Set up a parser to ensure the output conforms to the Pydantic model
    parser = PydanticOutputParser(pydantic_object=Section)

    # Extract and return the percentages
    result = chain.invoke({"metric": metric})

    try:
        # Parse the JSON output
        parsed_result = parser.parse(result.content)

    except Exception as e:
        raise ValueError(f"Failed to parse JSON from completion: {e}")

    # Convert the parsed result to a dictionary
    result_dict = parsed_result.dict()

    # Return the result as a Flask JSON object
    return jsonify(result_dict)