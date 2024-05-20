from flask import Flask
from flask_session import Session
from redis import Redis
from flask_bcrypt import Bcrypt
from flask_cors import CORS
from blueprints.patentRetrieval.patentRetrieval import patentRetrieval
from blueprints.llmCalls.llmCalls import llmCalls
from blueprints.operations.operations import operations

app = Flask(__name__)
bcrypt = Bcrypt(app)

# Redis session configuration
app.config['SESSION_TYPE'] = 'redis'
app.config['SESSION_REDIS'] = Redis(host='localhost', port=6379)

# Initialize Flask-Session
Session(app)

# CORS configuration - replace with the actual frontend URL
CORS(app, origins=["http://localhost:3000"])

# Registering the blueprints with the Flask app
app.register_blueprint(patentRetrieval, url_prefix="/patents")
app.register_blueprint(llmCalls, url_prefix="/llm")
app.register_blueprint(operations, url_prefix="/ops")

# Load additional configuration from settings.py
app.config.from_pyfile("settings.py")

if __name__ == "__main__":
    app.run(debug=True)
