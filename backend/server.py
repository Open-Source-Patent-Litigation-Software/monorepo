from flask import Flask
from blueprints.patentRetrieval.patentRetrieval import patentRetrieval
app = Flask(__name__)
app.register_blueprint(patentRetrieval)

@app.route("/")
def basic():
    """Basic route to check if the server is running."""
    return "We are about to get to work"


if __name__ == "__main__":
    app.run(debug=True)
