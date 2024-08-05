// Data Models
class Summaries {
  patent string @description("This field should be the patent number.")
  title string @description("This field should be the title of the patent.")
  filing_date string @description("This field should be the filing date of the patent.")
  summary string @description("This field should just be a summary of the patent.")
}
function WordDocSummaries(patent_text: string) -> Summaries {
  // LLM client with params you want (not pictured)
  client GPT4o_mini

  // BAML prompts use Jinja syntax
  prompt #"
        I am going to give you a list of patents with their respective claims, abstracts, and titles. For each patent, summarize what the patent is about and its key features in 100 words.

        Make sure to include all of the independent claims in the summary. Below are the patents and their respective claims and abstract sections:
    Search Query Text:
    ---
    {{ patent_text }}
    ---

    {{ ctx.output_format }}

    JSON:
  "#
}

test TestCoffeBrewingPatent {
  functions [WordDocSummaries]
  args {
    patent_text #"
    Abstract
    The coffee maker for brewing powder coffee contained in a cartridge comprises a brewing chamber adapted to receive the cartridge, at least one punching member for punching the cartridge and a pump for feeding brewing water into the brewing chamber. In order to avoid that the prepared coffee shows froth at its surface, the coffee maker comprises means for restricting the amount of water fed by the pump into the brewing chamber per unit of time. This means ensures that the brewing water flows through the cartridge essentially unpressurized.
    Claims
    1. be used for brewing the coffee machine of containing in the coffee powder of material package, it comprises: the beverage making cavity that is suitable for holding described coffee powder material package; At least one is used for dashing wears the device of described coffee powder material package; With heat is brewed water and infeeds pump in the described beverage making cavity; It is characterized in that, also comprise the device that brews the water yield that infeeds in the restricted unit time optionally in the described beverage making cavity, this device make brew water flow through to not supercharging basically the described coffee powder material package that is arranged in described beverage making cavity with produce non-foam coffee, perhaps make brew water under high pressure flow through be arranged in described beverage making cavity described coffee powder material package to produce espresso.
    2. according to the coffee machine of claim 1, it is characterized in that: be used for limiting the water yield that brews that infeeds described beverage making cavity in the described device restricted unit time that brews the water yield and be no more than per hour 12 liters.
    3. according to the coffee machine of claim 1, it is characterized in that: be provided with and be used for dashing at least two punching parts wearing material package bottom and material package lid, be used for utilizing described pump to dash by described punching part before being conducted to material package and wear the described bottom of described material package and the device of described lid brewing water thereby be provided with.
    4. according to the coffee machine of claim 1, it is characterized in that: described beverage making cavity comprises material package supporter and sealing plate, each of described material package supporter and described sealing plate all is provided with the punching part, thereby described coffee machine also comprises the device that makes described material package supporter and described sealing plate move to its closed condition each other from the opening of described beverage making cavity, thereby when sealing during described beverage making cavity, the described material package of utilizing described punching part to make to be contained in the described beverage making cavity at its lid place and the place, bottom dashed and worn.
    5. according to the coffee machine of claim 4, it is characterized in that: both are provided with the punching part that is positioned at central authorities described sealing plate and described material package supporter.
    6. according to the coffee machine of claim 4, it is characterized in that: described sealing plate or described material package supporter are provided with the punching part that is positioned at central authorities.
    7. according to the coffee machine of claim 1, it is characterized in that: the device that brews the water yield that is used for infeeding in the restricted unit time described beverage making cavity comprises the device that is used to limit described pump discharge.
    8. according to the coffee machine of claim 7, it is characterized in that: described pump is electrically driven (operated) with exchanging, thereby the described device that is used to limit described pump discharge comprises phase control regulator, radio-frequency pulse controller or frequency-variable controller.
    9. according to the coffee machine of claim 1, it is characterized in that: the device that brews the water yield that is used for infeeding in the restricted unit time described beverage making cavity comprises adjustable choke valve, described choke valve is inserted into from described pump to the pipeline that described beverage making cavity is extended, is used to change the effective cross section circulation area of described pipeline.
    10. according to the coffee machine of claim 9, it is characterized in that: be provided with the manually operated selector switch that is connected in control module, thereby described control module is operably connected to described pump and/or described choke valve to be conducted to the water yield that brews of described beverage making cavity in the restricted unit time.
    11. the coffee machine according to claim 4 is characterized in that: when the described beverage making cavity of sealing, described sealing plate is suitable for pushing described material package against the end face of described material package supporter along the annular seating zone.
    12. coffee machine according to claim 10, also comprise: being used to decode is located at least one sensor of the label or tag on the described material package, comes to be conducted in the restricted unit time water yield that brews of described beverage making cavity according to the information content of described label or tag thereby described sensor is operably connected to described control module.
    "#
  }
}
