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