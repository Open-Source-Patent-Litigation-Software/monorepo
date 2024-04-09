from flask import Blueprint, request, jsonify
from langchain_openai import OpenAI
from settings import OPEN_AI_KEY

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")

"""Creating an instance of the LLM class."""
llm = OpenAI(api_key=OPEN_AI_KEY)


@llmCalls.route("/analyze", methods=["GET"])
def askQuestion():
    """Route to ask a question to the LLM model."""
    llm.invoke(
        "What are some theories about the relationship between unemployment and inflation?"
    )
    for chunk in llm.stream(
        "What are some theories about the relationship between unemployment and inflation?"
    ):
        print(chunk, end="", flush=True)
    return jsonify({"message": "Ask question route is working!"})
