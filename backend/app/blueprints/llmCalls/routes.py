from flask import Blueprint, jsonify, request
import json
from langchain_openai import OpenAI
from app.settings import OPEN_AI_KEY
from utils.metrics import extractTheMetrics, extractSpecificPercentages
from .factory import LLMCallFactory

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")


@llmCalls.route("/obtainMetrics", methods=["POST"])
def obtainMetrics():
    """Route to extract metrics from a given text."""
    try:
        # get data from JSON
        data = request.get_json()

        # get handler object with parsed data
        handler = LLMCallFactory.getHandler('m', data)

        # handle the request
        response = handler.handleRequest()

        # return jsonified response
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500


@llmCalls.route("/extractSpecificPatentMetrics", methods=["POST"])
def extractSpecificPatentMetrics():
    """Route to extract specific metrics from a given patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get handler object with parsed data
        handler = LLMCallFactory.getHandler('p', data)

        # handle the request
        response = handler.handleRequest()

        # return jsonified response
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

@llmCalls.route("/getCitation", methods=["POST"])
def getCitation():
    """Route to extract highlighted text based on metrics for a given patent."""
    try:
        # get data from JSON
        data = request.get_json()

        # get handler object with parsed data
        handler = LLMCallFactory.getHandler('c', data)

        # handle the request
        response = handler.handleRequest()

        # return jsonified response
        return jsonify(response), 200
    except ValueError as e:
        # Handle validation errors
        return jsonify({'error': str(e)}), 400
    except Exception as e:
        # Handle any other unexpected errors
        return jsonify({'error': f"An unexpected error occurred: {str(e)}"}), 500

