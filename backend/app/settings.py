from os import environ
from dotenv import load_dotenv
load_dotenv() # load variables in .env file

OPEN_AI_KEY = environ.get("OPEN_AI_KEY")
PQ_AI_KEY = environ.get("PQ_AI_KEY")
FRONTEND_URL = environ.get("FRONTEND_URL")
NEON_CONNECTION_STRING = environ.get("NEON_CONNECTION_STRING")
REDIS_URL = environ.get("REDIS_URL")
FLASK_ENV = environ.get("FLASK_ENV")
