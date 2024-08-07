import boto3


class AWSFactory:
    def __init__(self, aws_type):
        """Create an AWS factory."""
        self.aws_type = aws_type

    def generate_client(self):
        """Create a new AWS wrapper."""
        if self.aws_type == "s3":
            return S3()
        elif self.aws_type == "dynamodb":
            return Dynamo()
        else:
            raise ValueError("Invalid AWS type")


class AWS_Client:
    def __init__(self):
        """Create an AWS client."""
        pass

    def list(self):
        """List all resources."""
        pass

    def create(self):
        """Create a new resource."""
        pass

    def delete(self):
        """Delete a resource."""
        pass

    def confirm_connection(self):
        """Confirm connection to AWS."""
        pass


class S3(AWS_Client):
    def __init__(self):
        """Create an S3 client."""
        self.client = boto3.client("s3")
        super().__init__()

    def list(self):
        """List all S3 buckets."""
        response = self.client.list_buckets()
        print(response)


class Dynamo(AWS_Client):
    def __init__(self):
        """Create a DynamoDB client."""
        self.client = boto3.client("dynamodb")
        super().__init__()
        print("DynamoDB client created")

    def confirm_connection(self):
        """Confirm connection to DynamoDB."""
        try:
            response = self.client.list_tables()
            print(f"Connection successful. Tables found: {response['TableNames']}")
            return True
        except Exception as e:
            print(f"Connection failed: {str(e)}")
            return False

    def list(self):
        """List all DynamoDB tables."""
        try:
            response = self.client.list_tables()
            print("DynamoDB tables:")
            for table in response["TableNames"]:
                print(f"- {table}")
        except Exception as e:
            print(f"Error listing tables: {str(e)}")


if __name__ == "__main__":
    """Run the main function."""
    # S3 example
    aws_factory = AWSFactory("s3")
    s3 = aws_factory.generate_client()
    s3.list()

    # DynamoDB example
    aws_factory = AWSFactory("dynamodb")
    dynamodb = aws_factory.generate_client()

    # Confirm DynamoDB connection
    if dynamodb.confirm_connection():
        dynamodb.list()

"""
DOCUMENTATION:
https://boto3.amazonaws.com/v1/documentation/api/latest/index.html
# Example: Upload a file
s3.upload_file('local_file.txt', 'your-bucket-name', 'remote_file.txt')

# Example: Download a file
s3.download_file('your-bucket-name', 'remote_file.txt', 'downloaded_file.txt')
"""
