import os
from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Import extensions
from app.extensions import bcrypt

# Import blueprints
from app.blueprints.patentRetrieval.patentRetrieval import patentRetrieval
from app.blueprints.llmCalls.routes import llmCalls
from app.blueprints.operations.operations import operations


def create_app():
    app = Flask(__name__)

    # Load configuration from environment variables
    app.secret_key = os.getenv("SECRET_KEY")  # Ensure you set a secret key in your .env file

    # CORS configuration - replace with the actual frontend URL
    if os.getenv("FLASK_ENV") == "development":
        print("Running in development mode. CORS is enabled for all origins.")
        CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})
    else:
        CORS(app, origins=[os.getenv("FRONTEND_URL")])

    # Load additional configuration from settings.py
    app.config.from_pyfile("settings.py")

    # Register blueprints
    app.register_blueprint(llmCalls, url_prefix="/llm")
    app.register_blueprint(patentRetrieval, url_prefix="/patents")
    app.register_blueprint(operations, url_prefix="/ops")

    # Initialize extensions with app
    bcrypt.init_app(app)

    return app
