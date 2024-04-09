from flask import Flask
from blueprints.patentRetrieval.patentRetrieval import patentRetrieval
from blueprints.llmCalls.llmCalls import llmCalls

app = Flask(__name__)

"""Registering the blueprints with the Flask app."""
app.register_blueprint(patentRetrieval, url_prefix="/patentRetrieval")
app.register_blueprint(llmCalls, url_prefix="/llm")

app.config.from_pyfile("settings.py")

if __name__ == "__main__":
    app.run(debug=True)
