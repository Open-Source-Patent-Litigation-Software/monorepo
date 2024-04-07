from flask import Flask

app = Flask(__name__)


@app.route("/")
def basic():
    return "We are about to get to work"
