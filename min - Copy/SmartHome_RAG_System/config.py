
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Base directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)  # For accessing files in 'min' if needed

# Vector DB Config
VECTOR_DB_NAME = "vector_db.index"
METADATA_NAME = "metadata.txt"
VECTOR_DB_PATH = os.path.join(BASE_DIR, VECTOR_DB_NAME)
METADATA_PATH = os.path.join(BASE_DIR, METADATA_NAME)

# Models
# Embedding Model
EMBEDDING_MODEL_NAME = "all-MiniLM-L6-v2"

# LLM Provider Options: 'ollama', 'openai', 'grok'
# Change this to switch providers
LLM_PROVIDER = os.getenv("LLM_PROVIDER", "openai")

# OpenAI Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
OPENAI_MODEL_NAME = "gpt-4o-mini" # Fast model

# Grok Configuration
GROK_API_KEY = os.getenv("GROK_API_KEY", "")
GROK_MODEL_NAME = "grok-beta"

# Groq Configuration
GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_MODEL_NAME = "llama-3.3-70b-versatile" # More powerful, better reasoning and SQL

# App Config
MAX_RETRIES = 3
FLASK_DEBUG = True
FLASK_PORT = 5001
