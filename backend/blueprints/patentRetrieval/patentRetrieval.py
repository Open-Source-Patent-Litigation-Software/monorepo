from flask import Blueprint, request, jsonify
import requests
from settings import PQ_AI_KEY


patentRetrieval = Blueprint("patentRetrieval", __name__, template_folder="templates")

mockData = [
    {
        "id": "US9462409B2",
        "type": "patent",
        "publication_id": "US9462409B2",
        "title": "Mobile unit for controlling the comfort and/or security conditions in a building",
        "abstract": '"Mobile control unit comprising:    "',
        "publication_date": "2016-10-04",
        "www_link": "https://patents.google.com/patent/US9462409B2/en",
        "owner": "Somfy SAS",
        "image": "https://api.projectpq.ai/patents/US9462409B2/thumbnails/1",
        "alias": "Mignot",
        "inventors": ["Pierre Mignot"],
        "score": 0.4422205686569214,
        "snippet": None,
        "mapping": None,
        "index": "H04L",
    },
    {
        "id": "US20190337208A1",
        "type": "patent",
        "publication_id": "US20190337208A1",
        "title": "REMOTE CONTROLLER FOR CONTROLLING APPARATUS BY DIVERTING FEEDBACK SIGNAL FROM NATIVE CONTROLLER TO THE REMOTE CONTROLLER AND METHODS FOR SAME",
        "abstract": "A remote controller can be provided on any apparatus that employs feedback control from a native controller to add functionality to the apparatus where the native controller is not capable of providing such functionality independently.",
        "publication_date": "2019-11-07",
        "www_link": "https://patents.google.com/patent/US20190337208A1/en",
        "owner": "IMFLUX INC.",
        "image": "https://api.projectpq.ai/patents/US20190337208A1/thumbnails/1",
        "alias": "Burns et al.",
        "inventors": ["Brian Matthew Burns", "Gene Michael Altonen"],
        "score": 0.4520869851112366,
        "snippet": None,
        "mapping": None,
        "index": "B29C",
    },
    {
        "id": "US20210333807A1",
        "type": "patent",
        "publication_id": "US20210333807A1",
        "title": "METHOD AND SYSTEM FOR CONTROLLING AIRCRAFT",
        "abstract": "Embodiments of the present invention relate to the technical field of aircrafts and provide an aircraft control method and a flight control system. The method is applicable to an aircraft and includes: connecting a remote control to a master terminal; connecting the master terminal to at least one slave terminal, so that each of the at least one slave terminal is connected to the master terminal; determining that the remote control has been connected to the aircraft; and controlling, by the remote control, the aircraft according to control instructions transmitted by the master terminal and/or the at least one slave terminal. By means of the method, providing each terminal with a remote control can be avoided, thereby reducing the burden of holding remote controls and reducing costs.",
        "publication_date": "2021-10-28",
        "www_link": "https://patents.google.com/patent/US20210333807A1/en",
        "owner": "AUTEL ROBOTICS CO., LTD.",
        "image": "https://api.projectpq.ai/patents/US20210333807A1/thumbnails/1",
        "alias": "Feng et al.",
        "inventors": ["Yinhua Feng", "Hongliang Yu"],
        "score": 0.48993945121765137,
        "snippet": None,
        "mapping": None,
        "index": "H04W",
    },
    {
        "id": "US20190060007A1",
        "type": "patent",
        "publication_id": "US20190060007A1",
        "title": "User Control Pendant Assembly For Remotely Controlling Surgical Device",
        "abstract": "A user control pendant assembly for remotely controlling a surgical device includes a housing, a plurality of user controls associated with the housing, one of the user controls being actuated by a user during operation of the surgical device, and an accessory device coupled to the housing to allow a user to perform an ancillary function during operation of the surgical device.",
        "publication_date": "2019-02-28",
        "www_link": "https://patents.google.com/patent/US20190060007A1/en",
        "owner": "MAKO Surgical Corp.",
        "image": "https://api.projectpq.ai/patents/US20190060007A1/thumbnails/1",
        "alias": "Fossez",
        "inventors": ["John Fossez"],
        "score": 0.49243706464767456,
        "snippet": None,
        "mapping": None,
        "index": "A61B",
    },
    {
        "id": "US10059446B2",
        "type": "patent",
        "publication_id": "US10059446B2",
        "title": "Ground vehicle-like control for remote control aircraft",
        "abstract": "A hand-held radio transmit controller for remotely controlling an aircraft, and a method for controlling a remote control aircraft offering ground vehicle-like control.",
        "publication_date": "2018-08-28",
        "www_link": "https://patents.google.com/patent/US10059446B2/en",
        "owner": "Traxxas LP",
        "image": "https://api.projectpq.ai/patents/US10059446B2/thumbnails/1",
        "alias": "Erhart et al.",
        "inventors": [
            "Wesley Ronald Erhart",
            "Scott Rollin Michael Schmitz",
            "Thomas Michael Kawamura",
            "Richard Douglas Hohnholt",
            "Kent Poteet",
        ],
        "score": 0.4977037310600281,
        "snippet": None,
        "mapping": None,
        "index": "G05D",
    },
    {
        "id": "US11181870B2",
        "type": "patent",
        "publication_id": "US11181870B2",
        "title": "Systems and methods for safety-enabled control",
        "abstract": "Systems and methods for safety-enabled control.",
        "publication_date": "2021-11-23",
        "www_link": "https://patents.google.com/patent/US11181870B2/en",
        "owner": "Fort Robotics, Inc.",
        "image": "https://api.projectpq.ai/patents/US11181870B2/thumbnails/1",
        "alias": "Bivans et al.",
        "inventors": ["Nathan Bivans", "Walid Dimachkie"],
        "score": 0.5016613006591797,
        "snippet": None,
        "mapping": None,
        "index": "G05B",
    },
    {
        "id": "US9827059B2",
        "type": "patent",
        "publication_id": "US9827059B2",
        "title": "Adaptable integrated energy control system for electrosurgical tools in robotic surgical systems",
        "abstract": "A teleoperated surgical system may comprise a plurality of teleoperated surgical instruments; a user input device; and a controller operably coupled to the user input device and to the plurality of surgical instruments. The user input device may be configured to transmit an activation command to cause activation of a function of a first one of the plurality of surgical instruments in response to input at the user input device, the function being supported by remote-control supply equipment. The controller may be configured to output a feedback command to cause feedback to a user, the feedback indicating the first one of the plurality of surgical instruments is configured for activation in response to the activation command.",
        "publication_date": "2017-11-28",
        "www_link": "https://patents.google.com/patent/US9827059B2/en",
        "owner": "INTUITIVE SURGICAL OPERATIONS, INC.",
        "image": "https://api.projectpq.ai/patents/US9827059B2/thumbnails/1",
        "alias": "Robinson et al.",
        "inventors": [
            "David W. Robinson",
            "Thomas R. Nixon",
            "Michael Hanuschik",
            "Randal P. Goldberg",
            "Jason Hemphill",
            "David Q. Larkin",
            "Paul Millman",
        ],
        "score": 0.5024144649505615,
        "snippet": None,
        "mapping": None,
        "index": "A61B",
    },
    {
        "id": "US9602584B2",
        "type": "patent",
        "publication_id": "US9602584B2",
        "title": "System with distributed process unit",
        "abstract": "The present invention provides a system with a separate computing unit, comprising: a primary computing device comprising a computing unit, a control interface unit via which a user enters an instruction that causes the computing unit to perform the processing operation or the computing operation to generate an instruction code, and a first wireless communication unit transmitting a first wireless signal containing the instruction code; and a remote control device comprising an instruction implementation unit, and a second wireless communication unit receiving the first wireless signal and sending the instruction code in the first wireless signal to the instruction implementation unit to implement the instruction code; wherein the operation of the instruction implementation unit of the remote control device is controlled by the instruction code.",
        "publication_date": "2017-03-21",
        "www_link": "https://patents.google.com/patent/US9602584B2/en",
        "owner": "Gemtek Technology Co., Ltd.",
        "image": "https://api.projectpq.ai/patents/US9602584B2/thumbnails/1",
        "alias": "Chen",
        "inventors": ["Hung Wen Chen"],
        "score": 0.5027182102203369,
        "snippet": None,
        "mapping": None,
        "index": "H04L",
    },
    {
        "id": "US20170208665A1",
        "type": "patent",
        "publication_id": "US20170208665A1",
        "title": "DISTRIBUTED CONTROL SYSTEM OPERATION AND CONFIGURATION",
        "abstract": "A control system including an input component configured to receive an input and generate control information in response to the input; a communication link coupled to the input component; and a plurality of control components, each of the control components coupled to the input component through the communication link and configured to receive the control information and to actuate an associated actuator in response to the control information.",
        "publication_date": "2017-07-20",
        "www_link": "https://patents.google.com/patent/US20170208665A1/en",
        "owner": "LEVITON MANUFACTURING CO., INC.",
        "image": "https://api.projectpq.ai/patents/US20170208665A1/thumbnails/1",
        "alias": "LEINEN et al.",
        "inventors": [
            "RICHARD A. LEINEN",
            "DAVID E. BURGESS",
            "SCOTT ALEXANDER ANDERSON",
            "KEVIN PARSONS",
        ],
        "score": 0.5029829740524292,
        "snippet": None,
        "mapping": None,
        "index": "H05B",
    },
    {
        "id": "US20230343207A1",
        "type": "patent",
        "publication_id": "US20230343207A1",
        "title": "METHOD FOR DETECTING A CONFLICT",
        "abstract": "The invention relates to a computer-implemented method for detecting a conflict between a local control means and a distantly disposed remote control means. The method comprises a method step of receiving a first signal from the local control means. The method comprises a further method step of receiving a second signal from the remote control means. The method comprises a further method step of checking whether a conflict is present based on the first and the second signal. If a conflict was detected during the check, the method comprises a method step of providing conflict information, wherein the conflict information comprises information that a conflict is present.",
        "publication_date": "2023-10-26",
        "www_link": "https://patents.google.com/patent/US20230343207A1/en",
        "owner": "Siemens Healthcare GmbH",
        "image": "https://api.projectpq.ai/patents/US20230343207A1/thumbnails/1",
        "alias": "PFISTER et al.",
        "inventors": ["Marcus PFISTER", "Christian KAETHNER"],
        "score": 0.5070806741714478,
        "snippet": None,
        "mapping": None,
        "index": "G16H",
    },
]


@patentRetrieval.route("/makeQuery", methods=["GET"])
def patentRetrievalRoute():
    """Retrieve prior-art documents with text query."""
    searchRequest = request.args.get("search")
    endpoint = "https://api.projectpq.ai"

    # These are all tunable
    route = "/search/102"
    url = endpoint + route
    n = 10
    result_type = "patent"
    after = "2016-01-01"
    print(searchRequest)
    params = {  # create parameter object
        "q": searchRequest,  # search query
        "n": n,  # no. of results
        "type": result_type,  # exclude research papers
        "after": after,  # return patents published after this date
        "token": PQ_AI_KEY,  # API key
    }
    response = requests.get(url, params=params)  # send the request
    assert response.status_code == 200  # error check

    results = response.json().get("results")  # decode response
    if not results:
        return jsonify({"message": "No results found."})
    print(results)
    return jsonify({"results": mockData})
    # return jsonify({"results": results})
