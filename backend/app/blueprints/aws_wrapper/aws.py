import boto3
import uuid


class Dynamo:
    """
    An API to interact with AWS DynamoDB designed for Dulany
    Boto3 Documentation for DynamoDB:
    https://boto3.amazonaws.com/v1/documentation/api/latest/guide/dynamodb.html
    """

    def __init__(self):
        """Dynamo client constructor"""
        self.client = boto3.client("dynamodb")
        self.resource = boto3.resource("dynamodb")

    def list(self):
        """List all tables in DynamoDB"""
        try:
            response = self.client.list_tables()
            print("DynamoDB tables:")
            for table in response["TableNames"]:
                print(f"- {table}")
        except Exception as e:
            print(f"Error listing DynamoDB tables: {str(e)}")

    def confirm_connection(self):
        """Confirm connection to DynamoDB"""
        try:
            response = self.client.list_tables()
            print(
                f"DynamoDB connection successful. Tables found: {response['TableNames']}"
            )
            return True
        except Exception as e:
            print(f"DynamoDB connection failed: {str(e)}")
            return False

    def postItem(self, table_name: str, item: dict) -> None:
        """Post item to DynamoDB table ( Must Match Key Schema)"""
        try:
            table = self.resource.Table(table_name)  # type: ignore
            table.put_item(Item=item)
        except Exception as error:
            print(
                "Error creating item in DynamoDB table - function postItem() in Dynamo class"
            )
            print(error)

    def getItem(self, table_name: str, key: dict) -> dict | None:
        """Get item from DynamoDB table"""
        try:
            table = self.resource.Table(table_name)  # type: ignore
            response = table.get_item(Key=key)
            return response["Item"]
        except Exception as error:
            print(
                "Error getting item from DynamoDB table - function getItem() in Dynamo class"
            )
            print(error)
            return None

    def updateItem(
        self,
        table_name: str,
        key: dict,
        update_expression: str,
        expression_attribute_values: dict,
    ) -> None:
        """Update item in DynamoDB table || Untested"""
        try:
            table = self.resource.Table(table_name)  # type: ignore
            table.update_item(
                Key=key,
                UpdateExpression=update_expression,
                ExpressionAttributeValues=expression_attribute_values,
            )
        except Exception as error:
            print(
                "Error updating item in DynamoDB table - function updateItem() in Dynamo class"
            )
            print(error)

    def deleteItem(self, table_name: str, key: dict) -> None:
        """Delete item from DynamoDB table"""
        try:
            table = self.resource.Table(table_name)  # type: ignore
            table.delete_item(Key=key)
        except Exception as error:
            print(
                "Error deleting item from DynamoDB table - function deleteItem() in Dynamo class"
            )
            print(error)


class S3_CLIENT:
    """An API to interact with AWS S3 designed for Dulany"""

    def __init__(self):
        """S3 client constructor"""
        try:
            self.client = boto3.client("s3")
            self.resource = boto3.resource("s3")
        except Exception as e:
            print(f"Error initializing S3 client: {str(e)}")

    def create_temp_file(self, file_name):
        """Create a temporary file with a random name"""
        randomFileName = "".join([str(uuid.uuid4().hex[:10]), file_name])
        return randomFileName

    def create_bucket(self, bucketPrefix):
        """Create an S3 bucket"""

        # Get the current region (avoid hardcoding)
        session = boto3.session.Session()
        currentRegion = session.region_name

        # The generated bucket name must be between 3 and 63 chars long
        bucketName = "".join([bucketPrefix, str(uuid.uuid4())])

        bucketResponse = self.resource.create_bucket(
            Bucket=bucketName,
            CreateBucketConfiguration={"LocationConstraint": currentRegion},
        )
        print(bucketName, currentRegion)
        return bucketName, bucketResponse

    def postFile(self, bucket_name: str, file_path: str, key: str) -> None:
        """Post file to S3 bucket"""
        try:
            self.client.upload_file(file_path, bucket_name, key)
        except Exception as error:
            print("Error uploading file to S3 bucket")
            print(error)


def main():

    # # DynamoDB example
    # dynamo = AWSFactory("dynamodb").generate_client()
    # # test_item = {
    # #     "user": "devk@umich.edu",  # Partition key must be present
    # #     "instance_id": "querty12345",
    # #     "patent_id": "12345",
    # #     "patent_data": {
    # #         "title": "test_title",
    # #         "abstract": "test_abstract",
    # #         "inventors": ["test_inventor1", "test_inventor2"],
    # #         "assignees": ["test_assignee1", "test_assignee2"],
    # #         "date": "2021-10-10",
    # #         "url": "test_url",
    # #     },
    # # }
    # # dynamodb.postItem("patent_test", test_item)
    # print("Data added to DynamoDB")
    # test_item = dynamo.getItem(
    #     "patent_test",
    #     {
    #         "user": "devk@umich.edu",  # Partition key must be present
    #         "instance_id": "querty12345",
    #     },
    # )
    # print("Data retrieved from DynamoDB", test_item)

    # S3 example
    S3 = S3_CLIENT()
    S3.create_bucket("dulany-test-bucket")


if __name__ == "__main__":
    main()

"""
    def generate_unique_key(self) -> str:
        Generates unique patent instance key everytime a search is called.
        return str(uuid.uuid4())
"""
