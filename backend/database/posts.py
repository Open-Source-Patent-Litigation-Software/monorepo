import psycopg2
from psycopg2.extras import RealDictCursor
from settings import NEON_CONNECTION_STRING
from flask import jsonify
import bcrypt
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


"""{'firstName': 'dev', 'lastName': 'kunjadia', 'email': 'devk@umich.edu', 'phone': '7343866841', 'password': 'd'}"""


def registerUser(firstName: str, lastName: str, email: str, phone: str, password: str):
    print(firstName, lastName, email, phone, password)
    try:
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor()

        # Define the INSERT query with placeholders
        query = """
        INSERT INTO reg_user (email, first_name, last_name, phone, password)
        VALUES (%s, %s, %s, %s, %s);
        """
        # Define the values to be inserted
        values = (email, firstName, lastName, phone, password)

        # Execute the query with the provided values
        cur.execute(query, values)

        # Commit the transaction
        conn.commit()

        dataResponse = {
            "request": "success",
            "firstName": firstName,
            "lastName": lastName,
            "email": email,
            "phone": phone,
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


def signInUser(email: str, password: str):
    try:
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Define the INSERT query with placeholders
        print("email:", email)
        query = """
        SELECT * FROM reg_user WHERE email = %s;
        """
        # Define the values to be inserted
        values = (email,)
        print("here")

        # Execute the query with the provided values
        cur.execute(query, values)
        # Fetch the result
        result = cur.fetchone()
        passwordHash = result.get("password")
        
        print(bcrypt.check_password_hash(passwordHash, password))  

        if result == None:
            return jsonify({"error": "User not found"}), 404


        dataResponse = {
            "request": "success",
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
