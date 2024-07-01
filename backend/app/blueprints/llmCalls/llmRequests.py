from abc import abstractmethod
from typing import List
from flask import jsonify
from dotenv import load_dotenv
from langchain_core.pydantic_v1 import BaseModel, root_validator, ValidationError
from langchain_core.messages import HumanMessage, SystemMessage
from langchain_core.prompts import ChatPromptTemplate
from langchain.output_parsers import PydanticOutputParser
from langchain_openai import ChatOpenAI
import logging
import os
from utils.scraping import PatentScraper
from utils.scraping import extractPatentNum

class LlmRequests:
    def __init__(self):
        # when you create the child class, load in the OPENAI API key
        load_dotenv()
        self.OPEN_AI_KEY = os.environ.get("OPEN_AI_KEY")
        self.logger = logging.getLogger("__name__")

    def makeRequest(self, template, validator, args):
        # add some way to determine which model should be used based on the # of tokens
        model = "gpt-4o"

        # log the number of tokens
        self.logger.info(f"This request used about {len(template)/4} tokens")

        # create the llm model
        llm = ChatOpenAI(model=model, temperature=1, api_key=self.OPEN_AI_KEY)

        # Create a ChatPromptTemplate object
        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(content="You are a helpful assistant."),
                HumanMessage(content=template),
            ]
        )

        # Combine the prompt with the model
        chain = prompt | llm

        # invoke the model
        result = chain.invoke(args)

        # create a parser object
        parser = PydanticOutputParser(pydantic_object=validator)
        try:
            # parse the response
            parsed_result = parser.parse(result.content)
        except ValueError as e:
            # if there is an error raise an exception -> TODO: we will need to build out a system for thiss
            raise ValueError(f"Failed to parse JSON from completion: {e}")

        self.logger.info(result.usage_metadata)
        # return the parse dictionary
        return parsed_result.dict()

    # recieves a list of sections to scrape, returns a list of strs -> each str is a concatinated section
    def scrapePatent(self, sections: List[str], url: str) -> List[str]:
        # create the scraping object
        pn = extractPatentNum(url)
        scraper = PatentScraper(pn)

        output = []

        for section in sections:
            temp = scraper.getSection(section)
            output.append(temp)

        # return the outputted list from scraping
        return output
        
    @abstractmethod
    def handleRequest(self):
        # this is where the child function will handle the request
        pass