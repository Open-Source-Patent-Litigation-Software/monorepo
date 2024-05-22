from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain_openai import ChatOpenAI
import json
from flask import jsonify

OPEN_AI_KEY = "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"


def extractTheMetrics(searchQuery: str = "", model: str = "gpt-4"):
    """Extract 8 metrics from a given search query."""

    # Initialize the ChatOpenAI client with the provided API key and model
    llm = ChatOpenAI(model=model, temperature=0, api_key=OPEN_AI_KEY)

    # Define the template for the prompt
    metricTemplate = f"""
    Your job is to take a search query and extract 6-8 functions from it, which are then put into this format.
        
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

    Now, given the search query below, you must extract 6-8 functions from it.
    It is very important that you extract exactly 6-8 functions accurately and in the correct format.
    Do not make up anything that is not in the search query.
    I NEED EXACTY 6-8 FUNCTIONS. NO MORE, NO LESS.
    
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

    # Extract and return the metrics
    result = chain.invoke({"searchQuery": searchQuery})
    return result.content  # Return the content of the AIMessage object


def parseOutput(content):
    try:
        # Strip the outer quotes and any leading/trailing whitespace
        content = content.strip().strip("'").strip('"')

        # Load the string as a JSON object
        parsed_content = json.loads(content)

        return parsed_content
    except json.JSONDecodeError as e:
        print("Failed to parse content:", e)
        return None
