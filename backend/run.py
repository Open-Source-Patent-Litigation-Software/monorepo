from app import create_app
from dotenv import load_dotenv
from utils.logging.logging import setup_logger
import logging
import Celery
from flask import jsonify
import time
from authlib.integrations.flask_oauth2 import ResourceProtector
from utils.auth import Auth0JWTBearerTokenValidator

app, celery = create_app()


require_auth = ResourceProtector()
validator = Auth0JWTBearerTokenValidator(
    "dev-giv3drwd5zd1cqsb.us.auth0.com", "http://dulany-test"
)
require_auth.register_token_validator(validator)

logger = logging.getLogger("__name__")
setup_logger()

logger.info("Started Up")

@celery.task
def add_together(a, b):
    time.sleep(5)
    return a + b

@app.route("/add/<int:a>/<int:b>")
def add(a, b):
    task = add_together.delay(a, b)
    return jsonify({"task_id": task.id}), 202

@app.route("/s/<task_id>")
def get_status(task_id):
    task = add_together.AsyncResult(task_id)
    print(task)
    if task.state == 'PENDING':
        # Task is yet to start
        response = {
            'state': task.state,
            'status': 'Pending...',
            'result': None
        }
    elif task.state != 'FAILURE':
        # Task is completed or still running
        response = {
            'state': task.state,
            'status': task.info.get('status', ''),
            'result': task.result if task.state == 'SUCCESS' else None
        }
    else:
        # Task failed
        response = {
            'state': task.state,
            'status': str(task.info),  # This contains the error traceback
            'result': None
        }
    return jsonify(response)


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=8080)
