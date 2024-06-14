from app import create_app
from dotenv import load_dotenv
import os
from utils.logging.logging import setup_logger
import logging
app = create_app()
host = os.getenv("HOST")
port = os.getenv("PORT")
print(f"Running on {host}:{port}")

logger = logging.getLogger("__name__")
setup_logger()

logger.info("Started Up")

if __name__ == "__main__":
    app.run(debug=True, host=host, port=port)

