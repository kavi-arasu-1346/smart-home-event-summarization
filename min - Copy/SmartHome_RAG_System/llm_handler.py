
import requests
import json
import logging
import time
import re
from config import (
    LLM_PROVIDER, OPENAI_API_KEY, OPENAI_MODEL_NAME,
    GROK_API_KEY, GROK_MODEL_NAME,
    GROQ_API_KEY, GROQ_MODEL_NAME
)

class OnlineLLMClient:
    def __init__(self, api_key, model, provider="openai"):
        self.api_key = api_key
        self.model = model
        self.provider = provider
        
        if provider == "openai":
            self.base_url = "https://api.openai.com/v1/chat/completions"
        elif provider == "grok":
            self.base_url = "https://api.x.ai/v1/chat/completions"
        elif provider == "groq":
            self.base_url = "https://api.groq.com/openai/v1/chat/completions"
        elif provider == "ollama":
            self.base_url = "http://localhost:11434/api/chat"
        else:
            self.base_url = "https://api.openai.com/v1/chat/completions"
            
    def invoke(self, prompt, max_retries=5):
        if self.provider != "ollama" and not self.api_key:
            raise ValueError(f"API Key for {self.provider} is missing.")

        headers = {
            "Content-Type": "application/json"
        }
        if self.provider != "ollama":
            headers["Authorization"] = f"Bearer {self.api_key}"
        
        if self.provider == "ollama":
            data = {
                "model": "llama3.2",
                "messages": [
                    {"role": "system", "content": "You are a helpful smart home assistant."},
                    {"role": "user", "content": prompt}
                ],
                "stream": False,
                "options": {
                    "temperature": 0.1
                }
            }
        else:
            data = {
                "model": self.model,
                "messages": [
                    {"role": "system", "content": "You are a helpful smart home assistant."},
                    {"role": "user", "content": prompt}
                ],
                "temperature": 0.1
            }
        
        attempt = 0
        backoff = 2
        
        while attempt < max_retries:
            attempt += 1
            try:
                logging.debug(f"Sending request to {self.base_url} model={self.model} (Attempt {attempt})")
                response = requests.post(self.base_url, headers=headers, json=data, timeout=120)  # Extended timeout for local LLM
                
                # Special handling for Rate Limiting (429)
                if response.status_code == 429:
                    error_body = response.text
                    wait_time = backoff
                    
                    try:
                        err_json = response.json()
                        msg = err_json.get("error", {}).get("message", "")
                        match = re.search(r"try again in (\d+(\.\d+)?)s", msg)
                        if match:
                            wait_time = float(match.group(1)) + 0.5
                    except:
                        pass
                        
                    print(f"\n[RATE LIMIT] API Rate Limit Reached. Waiting {wait_time:.2f}s before retry (Attempt {attempt}/{max_retries})...")
                    time.sleep(wait_time)
                    backoff *= 1.5
                    continue

                response.raise_for_status()
                result = response.json()
                
                if self.provider == "ollama":
                    content = result.get("message", {}).get("content", "")
                else:
                    content = result["choices"][0]["message"]["content"]
                
                if not content:
                    raise ValueError("Empty response content")
                    
                return content.strip()
                
            except requests.exceptions.RequestException as e:
                error_msg = f"Error calling {self.provider} API: {str(e)}"
                if hasattr(e, 'response') and e.response is not None:
                    if e.response.status_code == 401 and self.provider != "ollama":
                        print("\n" + "!"*50)
                        print(f"AUTHENTICATION ERROR: Invalid {self.provider.upper()} API Key.")
                        print(f"Please open the '.env' file and replace '{self.provider.upper()}_API_KEY' with your actual key.")
                        print("!"*50 + "\n")
                        import sys
                        sys.exit(1)
                    error_msg += f" Response: {e.response.text}"
                
                logging.error(error_msg)
                
                if attempt == max_retries:
                    raise RuntimeError(error_msg) from e
                
                # For other errors (500, connection), wait briefly and retry
                time.sleep(2)
