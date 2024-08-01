# Define a logging configuration
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

from typing import List, Dict, Any, Optional
from pydantic import BaseModel, HttpUrl, root_model


class PatentInfo(BaseModel):
    abstract: str
    inventors: List[str]
    owner: str
    publication_date: str
    publication_id: str
    score: Dict[str, Any]
    title: str
    www_link: HttpUrl


class CitationEntry(BaseModel):
    after: Optional[str]
    before: Optional[str]
    highlight: Optional[str]


class CitationMetric(BaseModel):
    abstract: List[str]
    claims: List[str]
    description: List[CitationEntry]
    metric: str


class Citations(BaseModel):
    root_model: Dict[str, CitationMetric]


class PatentData(BaseModel):
    patentInfo: PatentInfo
    search: str
    summary: str
    citations: Citations


example_patent_data = {
    "patentInfo": {
        "abstract": "A refrigerator appliance having a cold brewed coffee system positioned within a chilled chamber of the refrigerator appliance is provided. In one example aspect, the system includes a housing defining a water reservoir and a coffee reservoir. The water reservoir is in fluid communication with a water supply via an inlet supply conduit. An inlet valve is positioned along the inlet supply conduit and selectively allows water into the water reservoir. The water within the water reservoir drips into the coffee reservoir where the water mixes with coffee materials received therein. Cold brewed coffee is produced within the coffee reservoir and may slowly drip into a coffee container positioned or docked beneath the housing.",
        "inventors": ["Ryan Joseph Thomas"],
        "owner": "Ryan Joseph Thomas",
        "publication_date": "2020-03-26",
        "publication_id": "US20200093320A1",
        "score": {"scores": [5, 4, 8, 4, 3, 5, 4, 3], "total": 36},
        "title": "COLD BREWED COFFEE SYSTEM IN A REFRIGERATOR APPLIANCE",
        "www_link": "https://patents.google.com/patent/US20200093320A1/en",
    },
    "search": "coffee machine",
    "summary": "",
    "citations": {
        "Alerts user when done.": {
            "abstract": [],
            "claims": [],
            "description": [],
            "metric": "Alerts user when done.",
        },
        "Allows for coffee strength adjustment.": {
            "abstract": [],
            "claims": [],
            "description": [
                {
                    "after": "Thus, the coffee grounds are not steeped in cold water as desired.",
                    "before": "Moreover, in some instances, users prefer that their coffee grounds be steeped in relatively cold water.",
                    "highlight": "Many conventional cold brewed coffee systems do not have a means for cooling or maintaining the cold temperature of the water.",
                },
                {
                    "after": "This may produce unsatisfactory coffee.",
                    "before": "Many conventional cold brewed coffee systems do not have a means for cooling or maintaining the cold temperature of the water.",
                    "highlight": "Thus, the coffee grounds are not steeped in cold water as desired.",
                },
                {
                    "after": "Further, after the coffee is brewed by such conventional systems, the produced coffee may be relatively warm (e.g., room temperature) and not chilled as desired.",
                    "before": "Thus, the coffee grounds are not steeped in cold water as desired.",
                    "highlight": "This may produce unsatisfactory coffee.",
                },
                {
                    "after": "In addition, the cold brewed coffee system includes an inlet valve positioned along the inlet supply conduit and movable between an open position and a closed position, the inlet valve configured for selectively allowing water to flow from the water supply to the reservoir.",
                    "before": "Further, the cold brewed coffee system includes a water level sensing system operable to detect when water within the reservoir has reached a predetermined water level.",
                    "highlight": "Also, the cold brewed coffee system includes an inlet supply conduit fluidly connecting a water supply with the reservoir.",
                },
                {
                    "after": "In some implementations, stirring device 270 is movable about an axis of rotation and may be driven by an electric drive (not shown), e.g., a motor.",
                    "before": "9, in some implementations, during steeping, or as water is provided from water reservoir 212 to coffee reservoir 214 at (310) or as cold brewed coffee 208 is provided from coffee reservoir 214 to coffee container 202 at (312), a stirring device 270 rotatably coupled with housing 210 may stir the steeping water/coffee grounds mixture or cold brewed coffee 208 within coffee reservoir 214.",
                    "highlight": "In this way, optimal extraction of the flavor from the coffee grounds may be achieved.",
                },
                {
                    "after": "FIG.",
                    "before": "Thus, consumers may have ready access to cold brewed coffee provided by cold brewed coffee system 200.",
                    "highlight": "Cold brewed coffee system 200 will be explained in detail below.",
                },
                {
                    "after": "Thus, to chill the produced to coffee to the desired temperature, a user is required to transport the brewed coffee to a chilled chamber.",
                    "before": "This may produce unsatisfactory coffee.",
                    "highlight": "Further, after the coffee is brewed by such conventional systems, the produced coffee may be relatively warm (e.g., room temperature) and not chilled as desired.",
                },
            ],
            "metric": "Allows for coffee strength adjustment.",
        },
        "Brews coffee.": {
            "abstract": [],
            "claims": [],
            "description": [],
            "metric": "Brews coffee.",
        },
        "Can use ground coffee.": {
            "abstract": [],
            "claims": [],
            "description": [
                {
                    "after": "In some implementations, stirring device 270 is movable about an axis of rotation and may be driven by an electric drive (not shown), e.g., a motor.",
                    "before": "9, in some implementations, during steeping, or as water is provided from water reservoir 212 to coffee reservoir 214 at (310) or as cold brewed coffee 208 is provided from coffee reservoir 214 to coffee container 202 at (312), a stirring device 270 rotatably coupled with housing 210 may stir the steeping water/coffee grounds mixture or cold brewed coffee 208 within coffee reservoir 214.",
                    "highlight": "In this way, optimal extraction of the flavor from the coffee grounds may be achieved.",
                },
                {
                    "after": "Many conventional cold brewed coffee systems do not have a means for cooling or maintaining the cold temperature of the water.",
                    "before": "Such units require constant manual water refilling and take up valuable countertop space.",
                    "highlight": "Moreover, in some instances, users prefer that their coffee grounds be steeped in relatively cold water.",
                },
                {
                    "after": "This may produce unsatisfactory coffee.",
                    "before": "Many conventional cold brewed coffee systems do not have a means for cooling or maintaining the cold temperature of the water.",
                    "highlight": "Thus, the coffee grounds are not steeped in cold water as desired.",
                },
                {
                    "after": "Further, in some implementations, the water is prevented from flowing into water reservoir 212 until a user provides another user input to commence the cold brewing process.",
                    "before": "Notably, the water that flows into water reservoir 212 is cooled or maintained at a chilled temperature.",
                    "highlight": "In this way, chilled water may be used to steep the coffee grounds within coffee reservoir 214 as will be explained more fully below.",
                },
                {
                    "after": "11 is configured in a similar manner as the cold brewed coffee system 200 of FIGS.",
                    "before": "1 and 2, for example.",
                    "highlight": "Generally, the cold brewed coffee system 300 of FIG.",
                },
            ],
            "metric": "Can use ground coffee.",
        },
        "Has a drip tray.": {
            "abstract": [],
            "claims": [],
            "description": [],
            "metric": "Has a drip tray.",
        },
        "Has a warming plate.": {
            "abstract": [],
            "claims": [],
            "description": [],
            "metric": "Has a warming plate.",
        },
        "Has a water reservoir.": {
            "abstract": [],
            "claims": [],
            "description": [
                {
                    "after": "In this way, chilled water may be used to steep the coffee grounds within coffee reservoir 214 as will be explained more fully below.",
                    "before": "When inlet valve is moved to the closed position, as noted above, water is prevented from flowing from water supply 204 to water reservoir 212.",
                    "highlight": "Notably, the water that flows into water reservoir 212 is cooled or maintained at a chilled temperature.",
                }
            ],
            "metric": "Has a water reservoir.",
        },
        "Has an automatic shutoff feature.": {
            "abstract": [],
            "claims": [],
            "description": [],
            "metric": "Has an automatic shutoff feature.",
        },
    },
}
