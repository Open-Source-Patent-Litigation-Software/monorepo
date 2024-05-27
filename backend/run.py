from app import create_app
from dotenv import load_dotenv
import os
app = create_app()
host = os.getenv("HOST")
port = os.getenv("PORT")
print(f"Running on {host}:{port}")
if __name__ == "__main__":
    app.run(debug=True, host=host, port=port)
