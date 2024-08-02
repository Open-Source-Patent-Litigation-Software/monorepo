client<llm> GPT4o_mini {
  provider openai
  options {
    model gpt-4o-mini
    api_key env.OPEN_AI_KEY
  }
}