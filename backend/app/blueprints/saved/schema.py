from pydantic import BaseModel, Field, field_validator
from typing import Dict, List, Optional
import logging


class HighlightedText(BaseModel):
    before: str
    highlight: str
    after: str


class Citations(BaseModel):
    abstract: Optional[List[HighlightedText]] = None
    claims: Optional[List[HighlightedText]] = None
    description: Optional[List[HighlightedText]] = None


class PatentInfo(BaseModel):
    abstract: str
    alias: str
    id: str
    image: str
    index: str
    inventors: List[str]
    mapping: Optional[None] = None
    owner: str
    publication_date: str
    publication_id: str
    score: float
    snippet: Optional[str] = None
    title: str
    type: str
    www_link: str


class PatentData(BaseModel):
    patentInfo: PatentInfo
    search: str
    summary: str
    percentages: Dict[str, float]
    citations: Dict[str, Citations]

    @field_validator("search")
    def validate_search(cls, value):
        if len(value) == 0:
            raise ValueError("Search string must be non-empty")
        return value

    @field_validator("patentInfo")
    def validate_patent_info(cls, value):
        if value.id == "":
            raise ValueError("Patent ID must be non-empty")
        return value


class PatentResponse(BaseModel):
    data: PatentData
