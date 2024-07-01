import atexit
import json
import logging.config
import logging.handlers
from pathlib import Path

def setup_logger():
    # Load the logging configuration
    config_file = Path("utils/logging/config.json")
    with open(config_file, 'r') as f:
        config = json.load(f)

    logging.config.dictConfig(config)