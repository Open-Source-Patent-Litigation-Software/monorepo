def validate_json(data, required_fields):
    """Validate the JSON data based on required fields and their types."""
    for field, field_type in required_fields.items():
        if field not in data or not isinstance(data[field], field_type) or data[field] == "":
            return False, f"Invalid or missing {field} data"
    return True, None