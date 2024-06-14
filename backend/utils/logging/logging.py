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
    queue_handler = logging.getHandlerByName("queue_handler")

    if queue_handler is not None:
        queue_handler.listener.start()
        atexit.register(queue_handler.listener.stop)