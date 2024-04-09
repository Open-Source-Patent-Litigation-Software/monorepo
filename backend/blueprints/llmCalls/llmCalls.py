from flask import Blueprint, request, jsonify

llmCalls = Blueprint("llmCalls", __name__, template_folder="templates")

