import os
import json
from typing import List, Dict, Union, Tuple
from dotenv import load_dotenv
from flask import jsonify
import requests
from bs4 import BeautifulSoup
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
from scraping import scrapeAbstract, scrapeClaims, scrapeDescription

load_dotenv()
OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY")

class PercentExtraction(BaseModel):
    data: Dict[str, float]

    @validator("data")
    def check_data(cls, v):
        if len(v) < 6 or len(v) > 10:
            raise ValueError("The data object must have between 6-10 key-value pairs.")
        for key, value in v.items():
            if not isinstance(value, (int, float)):
                raise ValueError("Each value in the data object must be a number.")
        return v

def extractHighlightedSections(
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
    Your job is to take three sections - claims, abstract and description - and a list of 6 - 10 metrics and extract the sentences relevant to each metric from each section.

    So I will give you the three sections and the metrics, and you will need to give me the senteces relevant to each metric by section and metric.

    The flow will look like this:
    I give you a search query and the 8 functions extracted from it. For example, this is a query and its functions:
    I give you three sections - claims, abstract and description - and the 6-10 metrics. For example, these are the three sections and the metrics:

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

    Now that you understand the flow, I will give you the metrics, claims Section, abstract section and description. You will need to extract the important sentences from each section.
    Metrics: {metrics}
    Claims Section: {claims_text}
    Abstract Section: {abstract_text}
    Description: {description_text}

    Try to make the percentages reasonably accurate. Just estimate it. If it is a related topic, but not directly mentioned, give a lower percentage, somewhere like 0.1-0.3. If it is directly mentioned, give a higher percentage.
    Output the result in the exact JSON format as shown above, with the metrics represented as the actual function names, and their percentages filled in accordingly. Do not include any extra text or explanation, just the JSON.
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
    parser = PydanticOutputParser(pydantic_object=PercentExtraction)

    # Extract and return the percentages
    result = chain.invoke({"searchQuery": search})

    try:
        # Parse the JSON output
        parsed_result = parser.parse(result.content)
    except Exception as e:
        raise ValueError(f"Failed to parse JSON from completion: {e}")

    # Convert the parsed result to a dictionary
    result_dict = parsed_result.dict()

    # Create the desired output format
    output = {
        "data": {metric: result_dict["data"][metric] for metric in metricsList},
    }

    # Return the result as a Flask JSON object
    return jsonify(output)