from pydantic import BaseModel
from typing import Dict, List, Optional


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