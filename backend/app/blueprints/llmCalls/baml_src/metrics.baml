// Data Models
class Metrics {
  sentences string[] @description("Every sentence should be a function. Basically a function of what is being patented. There must be 8 sentences.")
}
function ExtractPatentMetricsFromQuery(patent_text: string) -> Metrics {
  // LLM client with params you want (not pictured)
  client GPT4o_mini

  // BAML prompts use Jinja syntax
  prompt #"
    Parse the following patent and return a structured representation of the data in the schema below.

    Your job is to take a search query and extract 8 functions from it.

    Let me give you an example. Let's say the search query is:
        
    A coffee maker that dispenses both milk and coffee. The coffee can be made either from beans or from pods. To prevent spilling, there is a metal or plastic grate at the bottom. There is an electric screen to control it and alert the user once it's done.

        The functions you can extract from this are:
        Brews hot beverage.
        Dispenses milk.
        Can use coffee pods.
        Can use coffee beans.
        Has refillable water reservoir.
        Has grate to prevent spillage.
        Has electric screen for use.
        Alerts user when done.

    Search Query Text:
    ---
    {{ patent_text }}
    ---

    {{ ctx.output_format }}

    JSON:
  "#
}

test TestBacterialPrompt {
  functions [ExtractPatentMetricsFromQuery]
  args {
    patent_text #"
        A bacteria that divides rapidly and produces beneficial research chemicals.
    "#
  }
}


test TestCoffeePrompt {
  functions [ExtractPatentMetricsFromQuery]
  args {
    patent_text #"
        A machine that dispenses coffee.
    "#
  }
}

generator bamlMetricClient {
 output_type "python/pydantic"
 output_dir "../"
 version "0.52.1"
}