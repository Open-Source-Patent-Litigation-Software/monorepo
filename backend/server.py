from flask import Flask
from flask_cors import CORS
from blueprints.patentRetrieval.patentRetrieval import patentRetrieval
from blueprints.llmCalls.llmCalls import llmCalls

app = Flask(__name__)

# need to replace this with the actual frontend URL
CORS(app, origins=["http://localhost:3000"])

"""Registering the blueprints with the Flask app."""
app.register_blueprint(patentRetrieval, url_prefix="/patents")
app.register_blueprint(llmCalls, url_prefix="/llm")

app.config.from_pyfile("settings.py")

if __name__ == "__main__":
    app.run(debug=True)
