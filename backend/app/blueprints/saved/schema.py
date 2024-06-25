from pydantic import BaseModel, validator
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

    @validator("search")
    def validateSearch(cls, value):
        if len(value) > 0:
            logging.info("Search string must be non-empty")
            raise ValueError("Search string must be non-empty")
        return value

    @validator("patentNum")
    def validatePatentNum(cls, value):
        if len(value) > 0:
            raise ValueError("Patent number must be non-empty")
        return value
