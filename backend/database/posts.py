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


def registerUser(firstName: str, lastName: str, email: str, phone: str, password: str):
    """Register a new user with the provided details."""
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
        hashedPassword = bcrypt.generate_password_hash(password).decode("utf-8")

        values = (email, firstName, lastName, phone, hashedPassword)

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
    """Sign in a user with the provided email and password."""
    try:
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Define the SELECT query with placeholders
        query = "SELECT * FROM reg_user WHERE email = %s;"
        values = (email,)

        # Execute the query with the provided values
        cur.execute(query, values)
        # Fetch the result
        result = cur.fetchone()

        if result is None:
            return jsonify({"error": "User not found"}), 404

        passwordHash = result.get("password")

        if not bcrypt.check_password_hash(passwordHash, password):
            return jsonify({"error": "Invalid credentials"}), 401

        session["user_id"] = result.get("id")

        dataResponse = {
            "request": "success",
            "firstName": result.get("first_name"),
            "lastName": result.get("last_name"),
            "email": result.get("email"),
            "phone": result.get("phone"),
        }

        cur.close()
        conn.close()

        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()

def retrieveUserInfo():
    """Retrive User Info"""
    try:
        id = session["user_id"]
        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Define the SELECT query with placeholders
        query = "SELECT * FROM reg_user WHERE id = %s;"
        values = (id,)

        # Execute the query with the provided values
        cur.execute(query, values)
        # Fetch the result
        result = cur.fetchone()

        if result is None:
            return jsonify({"error": "User not found"}), 404

        dataResponse = {
            "request": "success",
            "firstName": result.get("first_name"),
            "lastName": result.get("last_name"),
            "email": result.get("email"),
            "phone": result.get("phone"),
        }

        cur.close()
        conn.close()

        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


def postOrganization(name: str, phone: str, features: str = "Basic"):
    """Create an organization and set the creator as the owner, admin, and user."""
    try:

        if "user_id" not in session:
            return jsonify({"error": "Not signed in"}), 401

        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor(cursor_factory=RealDictCursor)

        # Define the queries
        insert_organization_query = """
            INSERT INTO organization (name, phone, features)
            VALUES (%s, %s, %s)
            RETURNING id;
        """

        insert_organization_user_query = """
            INSERT INTO organization_user (organization_id, user_id)
            VALUES (%s, %s);
        """

        insert_organization_owner_query = """
            INSERT INTO organization_owner (organization_id, user_id)
            VALUES (%s, %s);
        """

        insert_organization_admin_query = """
            INSERT INTO organization_admin (organization_id, user_id)
            VALUES (%s, %s);
        """

        # Execute the insert organization query and get the new organization ID
        cur.execute(insert_organization_query, (name, phone, features))
        organization_id = cur.fetchone()["id"]

        user_id = session["user_id"]

        # Insert the creator as user, owner, and admin
        cur.execute(insert_organization_user_query, (organization_id, user_id))
        cur.execute(insert_organization_owner_query, (organization_id, user_id))
        cur.execute(insert_organization_admin_query, (organization_id, user_id))

        # Commit the transaction
        conn.commit()

        dataResponse = {"request": "success", "organization_id": organization_id}

        return jsonify(dataResponse), 200

    except psycopg2.Error as e:
        # Handle specific psycopg2 errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"Database error: {str(e)}"}), 500

    except Exception as e:
        # Handle any other unexpected errors
        if conn:
            conn.rollback()  # Rollback the transaction if an error occurs
        return jsonify({"error": f"An error occurred: {str(e)}"}), 500

    finally:
        if cur:
            cur.close()
        if conn:
            conn.close()


def addUserToOrganization(organization_id: int, userEmails: list, role: str):
    """Add a user to an organization with the specified role."""

    # 1. admin must be signed in
    try:
        # check sign in
        if "user_id" not in session:
            return jsonify({"error": "Not signed in"}), 401

        # Establish a connection
        conn = psycopg2.connect(NEON_CONNECTION_STRING)
        cur = conn.cursor()

        # Define the INSERT query with placeholders
        if role == "user":
            query = """
            INSERT INTO organization_user (organization_id, user_id)
            VALUES (%s, %s);
            """
        elif role == "owner":
            query = """
            INSERT INTO organization_owner (organization_id, user_id)
            VALUES (%s, %s);
            """
        elif role == "admin":
            query = """
            INSERT INTO organization_admin (organization_id, user_id)
            VALUES (%s, %s);
            """
        else:
            return jsonify({"error": "Invalid role"}), 400

        # Define the values to be inserted
        values = (organization_id, user_id)

        # Execute the query with the provided values
        cur.execute(query, values)

        # Commit the transaction
        conn.commit()

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
