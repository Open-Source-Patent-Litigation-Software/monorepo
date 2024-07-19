from langchain_core.pydantic_v1 import BaseModel
from typing import List, Optional, Dict

class PatentIDInput(BaseModel):
    pn: str
    user: str

class PatentIDOutput(BaseModel):
    summary: str
    pubNum: str
    title: str
    assignee: str
    appDate: str

class ZipInput(BaseModel):
    pns: List[str]
    user: str

class SearchInput(BaseModel):
    metrics: str
    user: str
    threshold: int
    numPatents: int

class DifScore(BaseModel):
    total: int
    scores: list[int]

class PatentObject(BaseModel):
    abstract: str
    owner: str
    pubDate: str
    patentNum: str
    patentLink: str
    totalScore: int
    score: DifScore
    people: list[str]

class SearchOutput(BaseModel):
    patents: list[PatentObject]