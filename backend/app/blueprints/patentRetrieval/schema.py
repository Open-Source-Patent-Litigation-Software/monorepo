from langchain_core.pydantic_v1 import BaseModel

class PatentIDInput(BaseModel):
    pn: str
    user: str

class PatentIDOutput(BaseModel):
    summary: str
    pubNum: str
    title: str
    assignee: str
    appDate: str
