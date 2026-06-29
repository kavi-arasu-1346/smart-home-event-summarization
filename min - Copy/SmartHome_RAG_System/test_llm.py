from llm_handler import OnlineLLMClient
import config

try:
    print(f"Provider: {config.LLM_PROVIDER}")
    llm = OnlineLLMClient(api_key=config.GROQ_API_KEY, model=config.GROQ_MODEL_NAME, provider=config.LLM_PROVIDER)
    res = llm.invoke("Hello, who are you?", max_retries=1)
    print("Response:", res)
except Exception as e:
    print("Error:", e)
