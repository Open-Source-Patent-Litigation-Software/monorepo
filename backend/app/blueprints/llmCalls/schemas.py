# this file is for pydantic validators
from typing import List, Optional
from langchain_core.pydantic_v1 import BaseModel, root_validator

class Quote(BaseModel):
    before: str
    highlight: str
    after: str

    @root_validator()
    def check_all_strings_not_empty(cls, values):
        if(not values.get("before") or not values.get("highlight") or not values.get("after")):
            raise ValueError('Before, highlight and after must contain text.')
        return values

class Section(BaseModel):
    claims: Optional[List[Quote]]
    abstract: Optional[List[Quote]]
    description: Optional[List[Quote]]

    # checks that at least 1 of the Claims, Abstract or Description Sections are there
    @root_validator(pre=True)
    def check_sections_not_all_empty(cls, values):
        if (
            not values.get("claims") and
            not values.get("abstract") and
            not values.get("description")
        ):
            raise ValueError('At least one of "claims", "abstract", or "description" must not be empty')
        return values

# validator for the input for Citations
class CitationsInput(BaseModel):
    patentURL: str
    metric_str: str
    user: str

    # validate that none of the strings are empty
    @root_validator()
    def checkEmptyStrings(cls, values):
        if(not values.get("patentURL") or not values.get("metric_str") or not values.get("user")):
            raise ValueError('None of the strings can be empty')
        return values