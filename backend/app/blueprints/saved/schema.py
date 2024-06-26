from pydantic import BaseModel, field_validator
from typing import Dict, List, Optional
import logging


class HighlightedText(BaseModel):
    after: str
    before: str
    highlight: str


class Citations(BaseModel):
    abstract: Optional[List[HighlightedText]]
    claims: Optional[List[HighlightedText]]
    description: Optional[List[HighlightedText]]


class PatentData(BaseModel):
    search: str
    patentNum: str
    percentages: Dict[str, float]
    citations: Dict[str, Citations]

    @field_validator("search")
    def validateSearch(cls, value):
        if len(value) == 0:
            raise ValueError("Search string must be non-empty")
        return value

    @field_validator("patentNum")
    def validatePatentNum(cls, value):
        if len(value) == 0:
            raise ValueError("Patent number must be non-empty")
        return value
