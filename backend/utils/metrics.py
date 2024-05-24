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

load_dotenv()
OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY")


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


""" Example usage
>>> search_query = "A coffee maker that dispenses both milk and coffee. The coffee can be made either from beans or from pods. To prevent spilling, there is a metal or plastic grate at the bottom. There is an electric screen to control it and alert the user once it's done."
>>> metrics = extractTheMetrics(search_query)
>>> print(metrics["functions"])
>>> print: ['Brews hot beverage.', 'Dispenses milk.', 'Can use coffee pods.', 'Can use coffee beans.', 'Prevents spilling with a grate.', 'Has a metal or plastic grate at the bottom.', 'Has an electric screen for control.', 'Alerts user when coffee is done.']
"""


def patentAndSearchMetricsExtractions():
    # Extract the metrics from the search and the query
    return
