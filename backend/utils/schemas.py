# this file is for pydantic validators
from typing import List, Optional, Dict
from langchain_core.pydantic_v1 import BaseModel, Field, root_validator, validator

""" Citations """


class CitationsInput(BaseModel):
    patentURL: str
    metrics: list[str]
    user: str

    # validate that none of the strings are empty
    @root_validator()
    def checkEmptyStrings(cls, values):
        if (
            not values.get("patentURL")
            or not values.get("metrics")
            or not values.get("user")
        ):
            raise ValueError("None of the strings can be empty")
        return values


""" Patent Searching """


class DifScore(BaseModel):
    scores: list[int]
    total: int


class PatentObject(BaseModel):
    user: str
    instance_id: str
    abstract: str
    title: str
    owner: str
    publication_date: str
    publication_id: str
    www_link: str
    score: DifScore
    inventors: list[str]


class SearchOutput(BaseModel):
    patents: list[PatentObject]


class SearchInput(BaseModel):
    metrics: str
    user: str
    threshold: int
    numPatents: int
    dynamoInstanceIds: list[str]


""" ZIP input """


class ZipInput(BaseModel):
    pns: list[str]
    user: str
