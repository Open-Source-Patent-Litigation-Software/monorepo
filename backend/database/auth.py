from sqlalchemy.orm import Session
from .models import  RegUser
from .databaseCall import DatabaseCall
from app.extensions import bcrypt
from flask import jsonify


class Auth(DatabaseCall):
    def __init__(self):
        super().__init__()

    def signInUser(self, email: str, password: str):
        try:
            self.logger.info("Signing in user")
            return jsonify({"message": "User signed in successfully."}), 200
        except Exception as e:
            self.logger.error(f"An error occurred during sign in: {e}")
            return jsonify({"error": f"An error occurred: {e}"}), 400

    def registerUser(
        self, firstName: str, lastName: str, email: str, phone: str, password: str
    ):
        try:
            self.logger.info("Registering user")
            return jsonify({"message": "User registered successfully."}), 200
        except Exception as e:
            self.logger.error(f"An error occurred during registration: {e}")
            return jsonify({"error": f"An error occurred: {e}"}), 400

    def signOutUser(self):
        try:
            # Implement sign out logic here
            self.logger.info("Sign out logic")
            return jsonify({"message": "User signed out successfully."}), 200
        except Exception as e:
            self.logger.error(f"An error occurred during sign out: {e}")
            return jsonify({"error": f"An error occurred: {e}"}), 400
