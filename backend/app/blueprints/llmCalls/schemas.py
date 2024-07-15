# this file is for pydantic validators
from typing import List, Optional, Dict
from langchain_core.pydantic_v1 import BaseModel, Field, root_validator, validator


class Quote(BaseModel):
    before: str
    highlight: str
    after: str

    @root_validator()
    def check_all_strings_not_empty(cls, values):
        if (
            not values.get("before")
            or not values.get("highlight")
            or not values.get("after")
        ):
            raise ValueError("Before, highlight and after must contain text.")
        return values


class CitationsExtraction(BaseModel):
    claims: Optional[List[Quote]]
    abstract: Optional[List[Quote]]

    # checks that at least 1 of the Claims, Abstract or Description Sections are there
    @root_validator(pre=True)
    def check_sections_not_all_empty(cls, values):
        if not values.get("claims") and not values.get("abstract"):
            raise ValueError(
                'At least one of "claims", "abstract", or "description" must not be empty'
            )
        return values


# validator for the input for Citations
class CitationsInput(BaseModel):
    patentURL: str
    metric: str
    user: str

    # validate that none of the strings are empty
    @root_validator()
    def checkEmptyStrings(cls, values):
        if (
            not values.get("patentURL")
            or not values.get("metric")
            or not values.get("user")
        ):
            raise ValueError("None of the strings can be empty")
        return values


class MetricExtraction(BaseModel):
    functions: List[str] = Field(
        description="A list of 8 extracted functions from the search query"
    )

    @validator("functions")
    def check_function_count(cls, v):
        if len(v) != 8:
            raise ValueError("There must be exactly 8 functions.")
        return v


class MetricInput(BaseModel):
    searchQuery: str
    user: str

    # validate that none of the strings are empty
    @root_validator()
    def checkEmptyStrings(cls, values):
        if not values.get("searchQuery") or not values.get("user"):
            raise ValueError("None of the strings can be empty")
        return values


class PercentagesInput(BaseModel):
    searchQuery: str
    user: str
    patentURL: str
    metrics: str

    # validate that none of the strings are empty
    @root_validator()
    def checkEmptyStrings(cls, values):
        if (
            not values.get("searchQuery")
            or not values.get("user")
            or not values.get("patentURL")
            or not values.get("metrics")
        ):
            raise ValueError("None of the strings can be empty")
        return values


class PercentExtraction(BaseModel):
    data: Dict[str, float]

    @validator("data")
    def check_data(cls, v):
        if len(v) < 6 or len(v) > 10:
            raise ValueError("The data object must have between 6-10 key-value pairs.")
        for key, value in v.items():
            if not isinstance(value, (int, float)):
                raise ValueError("Each value in the data object must be a number.")
        return v


# error checks the input of the json data
class SummaryInput(BaseModel):
    patentURL: str
    user: str

    @root_validator()
    def checkEmptyStrings(cls, values):
        if not values.get("user") or not values.get("patentURL"):
            raise ValueError("None of the strings can be empty")
        return values


"""Bulk Summaries"""


# validates the output of the model
class SummaryExtraction(BaseModel):
    summary: str


# Input for bulk summaries
class BulkInput(BaseModel):
    patent_ids: List[str]


# Output for a single summary
class PatentSummary(BaseModel):
    patent: str
    title: str
    filing_date: str
    summary: str


class BulkExtraction(BaseModel):
    summaries: List[PatentSummary]
