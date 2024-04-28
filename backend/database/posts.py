import psycopg2
from settings import NEON_CONNECTION_STRING
from flask import jsonify


def postToList(email: str, phoneNumber: str):
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
        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        # Close the cursor and connection
        cur.close()
        conn.close()
