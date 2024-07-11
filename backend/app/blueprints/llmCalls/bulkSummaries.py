from .llmRequests import LlmRequests
from .schemas import BulkInput, BulkExtraction
import requests
from bs4 import BeautifulSoup


class Bulk(LlmRequests):
    def __init__(self, data: dict):
        """Initialize the Bulk class."""
        try:
            print("bulk". data)
            # Validate the JSON data received from the client
            validatedInput = BulkInput(**data)

            # Set the variables
            self.user = validatedInput.user
            self.patentNumbers = validatedInput.patentNumbers

            # Initialize the parent class
            super().__init__()
        except ValueError as e:
            # Handle validation errors
            raise ValueError(f"Invalid input: {e}")


    def handleRequest(self):
        """Handle the request."""
        results = []

        for patent_number in self.patentNumbers:
            patent_info = self.get_patent_info(patent_number)
            summary = self.generate_summary(patent_info["Claims and Abstract"])
            results.append(
                {
                    "patentNumber": patent_number,
                    "title": patent_info["Title"],
                    "assignee": patent_info["Assignee"],
                    "applicationDate": patent_info["Application Date"],
                    "status": patent_info["Status"],
                    "summary": summary,
                }
            )

        return self.makeRequest(str({"results": results}), BulkExtraction, {})


    def get_patent_info(self, patent_number):
        """Get the patent information"""
        url = f"https://patents.google.com/patent/{patent_number}/en"
        response = requests.get(url)
        soup = BeautifulSoup(response.content, "html.parser")

        title = (
            soup.find("meta", {"name": "DC.title"})
            .get("content", "N/A")
            .replace("\n", "")
        )
        assignee = (
            soup.find("dd", {"itemprop": "assigneeCurrent"}).get_text(strip=True)
            if soup.find("dd", {"itemprop": "assigneeCurrent"})
            else "N/A"
        )
        application_date = soup.find("meta", {"name": "DC.date"}).get("content", "N/A")
        status = (
            soup.find("span", {"itemprop": "status"}).get_text(strip=True)
            if soup.find("span", {"itemprop": "status"})
            else "N/A"
        )
        claims_abstract = (
            soup.find("section", {"itemprop": "claims"}).get_text(strip=True)
            + "\n"
            + soup.find("section", {"itemprop": "abstract"}).get_text(strip=True)
        )

        return {
            "Publication Number": patent_number,
            "Title": title,
            "Assignee": assignee,
            "Application Date": application_date,
            "Status": status,
            "Claims and Abstract": claims_abstract,
        }


    def generate_summary(self, claims_abstract):
        """Generate the summary of the patent."""
        template = f"""
        I am going to give you the claims and abstract section of a patent. I want you to summarize what the patent is and the key features of it in 100 words.

        I want you to make sure you include all of the independent claims in the summary. Below are the claims and abstract sections:

        {claims_abstract}

        I want you to output your response in JSON format like this:
        ```json
        {{
            "summary": "your summary goes here"
        }}
        ```
        """

        result = self.makeRequest(template, BulkExtraction, {})
        return result["summary"]
