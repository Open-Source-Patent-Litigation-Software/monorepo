import requests
from bs4 import BeautifulSoup
from typing import List
from langchain.output_parsers import PydanticOutputParser
from langchain_core.prompts import PromptTemplate
from langchain_core.pydantic_v1 import BaseModel, Field, validator
from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from dotenv import load_dotenv
import os
import json
from bs4 import BeautifulSoup

load_dotenv()
OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY")


def scrapeClaims(url, headers=None):
    """Scrapes claims 1-N from a given patent URL on Google Patents."""
    try:
        response = requests.get(url, headers=headers)
        response.raise_for_status()  # Raise an exception for 4xx or 5xx status codes
    except requests.RequestException as e:
        print(f"Request failed: {e}")
        return None

    soup = BeautifulSoup(response.text, "html.parser")
    claim_dependent_sections = soup.find_all(class_="claim")

    seen = set()  # Using a set for seen items
    newClaims = []

    # Extracting the claims from the patent
    for section in claim_dependent_sections:
        claim_text_sections = [
            claim_text.get_text(strip=True)
            for claim_text in section.find_all(class_="claim-text")
        ]

        for item in claim_text_sections:
            if item not in seen:
                seen.add(item)
                newClaims.append(item)

    return newClaims  # Returning the list of claims


# Define the desired data structure using Pydantic
class MetricExtraction(BaseModel):
    functions: List[str] = Field(
        description="A list of 8 extracted functions from the search query"
    )

    @validator("functions")
    def check_function_count(cls, v):
        if len(v) != 8:
            raise ValueError("There must be exactly 8 functions.")
        return v


# Define the function to extract metrics
def extractTheMetrics(searchQuery: str = "", model: str = "gpt-4") -> MetricExtraction:
    """Extract 8 metrics from a given search query."""

    # Initialize the ChatOpenAI client with the provided API key and model
    llm = ChatOpenAI(model=model, temperature=0, api_key=OPEN_AI_KEY)

    # Define the template for the prompt
    metricTemplate = f"""
    Your job is to take a search query and extract 8 functions from it, which are then put into this format.
        
        [
            "Function 1",
            "Function 2",
            "Function 3",
            "Function 4",
            "Function 5",
            "Function 6",
            "Function 7",
            "Function 8"
        ]

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

    Now, given the search query below, you must extract 8 functions from it.
    It is very important that you extract exactly 8 functions accurately and in the correct format.
    Do not make up anything that is not in the search query.
    I NEED EXACTLY 8 FUNCTIONS. NO MORE, NO LESS.
    
    {searchQuery}
    """

    # Create a ChatPromptTemplate object
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=metricTemplate),
        ]
    )

    # Combine the prompt with the model
    chain = prompt | llm

    # Set up a parser to ensure the output conforms to the Pydantic model
    parser = PydanticOutputParser(pydantic_object=MetricExtraction)

    # Extract and return the metrics
    result = chain.invoke({"searchQuery": searchQuery})

    try:
        # Convert the result content into a list
        parsed_functions = json.loads(result.content)
        if not isinstance(parsed_functions, list):
            raise ValueError("The output from the model is not a list.")

        # Wrap the list in a dictionary and parse it
        parsed_result = parser.parse(json.dumps({"functions": parsed_functions}))
    except Exception as e:
        raise ValueError(f"Failed to parse functions from completion: {e}")

    return dict(parsed_result)  # Return the validated and parsed result as a dictionary


# Define the desired data structure using Pydantic
class PercentExtraction(BaseModel):
    metrics: List[List[str]] = Field(
        description="A list of extracted percentages for each metric and their respective percentages as the second value."
    )


def extractSpecificPercentages(
    search: str,
    user: str,
    patentURL: str,
    metrics: str,
    model: str = "gpt-4",
):
    claims = scrapeClaims(patentURL)
    metricsList = metrics.split(",")
    if not claims:
        raise ValueError("No claims found or failed to scrape.")

    claims_text = "\n".join(claims)

    percentageTemplate = f"""
    Your job is to take a search query and its associated metrics(aka functions) and extract the percentage of each metric using a patent's claims section.

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
    You will need to extract the percentage of each function from the search using infromation the claims section for the patent.

    The claims section of one of the examples patents looks like this:
    claims section:
        1. A coffee dispenser system, comprising: a coffee brewer unit; a container; a coffee supply channel disposed between the coffee brewer unit and the container to provide a fluid connection between the coffee brewer unit and the container for receiving and holding coffee from the coffee brewer unit; and an outlet channel for coffee which is connected to the container, wherein the coffee supply channel and the outlet channel for coffee both connect to the container at a bottom side of the container, wherein the coffee supply channel that connects to the container extends upwardly inside the container up to a highest level, wherein at said highest level an air relief chamber is provided to release air from the coffee transported through the coffee supply channel, and that from the air relief chamber a coffee mix channel extends downwardly to above and near to the bottom of the container.
        2. The coffee dispenser system of claim 1, wherein the container comprises heat insulating properties.
        3. The coffee dispenser system of claim 1, wherein the container comprises a thermos bottle provided with a screw connection to a bottom plate that closes off the thermos bottle.
        4. The coffee dispenser system of claim 1, wherein the container does not comprise heating facilities.
        5. The coffee dispenser system of claim 1, wherein the container is provided with an air vent channel which determines a maximum possible level of coffee in the container.
        6. The coffee dispenser system of claim 1, wherein the dispenser system further comprises a sensor system for measuring a level of coffee in the container.
        7. The coffee dispenser system of claim 6, wherein the sensor system connects to a control system that drives the coffee brewer unit so as to maintain the level of coffee in the container between a predefined minimum and maximum level.
    
    In this case, the percentages would be:
    percentages = 
            [
                ["Brews hot beverage.", 0.9]
                ["Dispenses milk.", 0.5]
                ["Can use coffee pods.", 0.3]
                ["Can use coffee beans.", 0.4]
                ["Has refillable water reservoir.", 0.8]
                ["Has grate to prevent spillage.", 0.2]
                ["Has electric screen for use.", 0.3]
                ["Alerts user when done.", 0.6]
            ]
    
    Now that you understand the flow, I will give you the search query, the user, and the patent ID. You will need to extract the percentage of each function in the claims section.
    Search Query: {search}
    Metrics: {metrics}
    Claims Section: {claims_text}

    Try to make the percentages reasonably accurate. Just estimate it. If it is a related topic, but not  directly mentioned, give a lower percentage, somewhere like 0.1-0.3. If it is directly mentioned, give a higher percentage.
    Literally only give the list portion back. SO NO EXTRA TEXT. JUST THE LIST.
    """

    # Initialize the ChatOpenAI client with the provided API key and model
    llm = ChatOpenAI(model=model, temperature=1, api_key=OPEN_AI_KEY)

    # Create a ChatPromptTemplate object
    prompt = ChatPromptTemplate.from_messages(
        [
            SystemMessage(content="You are a helpful assistant."),
            HumanMessage(content=percentageTemplate),
        ]
    )

    # Combine the prompt with the model
    chain = prompt | llm

    # Set up a parser to ensure the output conforms to the Pydantic model
    parser = PydanticOutputParser(pydantic_object=PercentExtraction)

    # Extract and return the percentages
    result = chain.invoke({"searchQuery": search})

    try:
        # Convert the result content into a list
        parsed_percentages = json.loads(result.content)
        if not isinstance(parsed_percentages, list):
            raise ValueError("The output from the model is not a list.")

        # Wrap the list in a dictionary and parse it
        parsed_result = parser.parse(json.dumps({"metrics": parsed_percentages}))
    except Exception as e:
        raise ValueError(f"Failed to parse percentages from completion: {e}")

    return dict(parsed_result)  # Return the validated and parsed result as a dictionary


# # Example usage:
# search_query = "Specifically, we are seeking to understand the W-3 FAD gene and what has been filed relating to this gene in micro algae. The W-3 FAD gene encodes the omega-3 fatty acid desaturase enzyme and has been shown to enhance lipid retention in Nannochloropsis and Chlorella"
# metrics = "Encodes omega-3 fatty acid desaturase enzyme., Enhances lipid retention in Nannochloropsis., Enhances lipid retention in Chlorella., Related to micro algae., Gene associated with W-3 FAD., Plays a role in lipid metabolism., Research shows increased omega-3 production., Contributes to lipid biosynthesis."
# patentURL = "https://patents.google.com/patent/US20170191094A1/en"
# patentURL2 = "https://patents.google.com/patent/US20200354670A1/en"
# percentages = extractSpecificPercentages(search_query, "user", patentURL2, metrics)
# print(percentages["metrics"])
