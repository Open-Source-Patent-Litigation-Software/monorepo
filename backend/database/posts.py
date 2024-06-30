import psycopg2
from psycopg2.extras import RealDictCursor
from app.settings import NEON_CONNECTION_STRING
from flask import jsonify, session
from app.extensions import bcrypt


def postToList(email: str, phoneNumber: str):
    """Post a user to the waitlist with the provided email and phone number."""
    try:
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor()

        # Define the INSERT query with placeholders
        query = "INSERT INTO waitlist (email, phone_number) VALUES (%s, %s)"

        # Define the values to be inserted
        values = (email, phoneNumber)

        # Execute the query with the provided values
        cur.execute(query, values)

        # Commit the transaction
        conn.commit()

        dataResponse = {
            "request": "success",
            "email": email,
            "phoneNumber": phoneNumber,
        }
        cur.close()
        conn.close()
        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        conn.rollback()  # Rollback the transaction if an error occurs
        cur.close()
        conn.close()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        conn.rollback()  # Rollback the transaction if an error occurs
        cur.close()
        conn.close()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500


def postContactQuery(firstName: str, lastName: str, email: str, message: str):
    """Post a contact query with the provided details."""
    try:
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor()

        # Define the INSERT query with placeholders
        query = """
        INSERT INTO contact_query (first_name, last_name, email, message)
        VALUES (%s, %s, %s, %s);
        """
        # Define the values to be inserted
        values = (firstName, lastName, email, message)

        # Execute the query with the provided values
        cur.execute(query, values)

        # Commit the transaction
        conn.commit()

        dataResponse = {
            "request": "success",
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "message": message,
        }

        cur.close()
        conn.close()

        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        conn.rollback()  # Rollback the transaction if an error occurs
        cur.close()
        conn.close()
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        conn.rollback()  # Rollback the transaction if an error occurs
        cur.close()
        conn.close()
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500
