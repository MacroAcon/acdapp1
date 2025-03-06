from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# Base configuration for all agents
BASE_CONFIG = {
    "temperature": 0.7,
    "request_timeout": 300,
    "seed": 42,
    "config_list": [
        {
            "model": "gpt-4-turbo-preview",
            "api_key": os.getenv("OPENAI_API_KEY"),
            "base_url": os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
        }
    ],
    "timeout": 300,
    "max_retries": 3,
    "retry_delay": 1,
}

# GPT-4 configuration for more complex reasoning
GPT4_CONFIG = {
    **BASE_CONFIG,
    "config_list": [
        {
            "model": "gpt-4-turbo-preview",
            "api_key": os.getenv("OPENAI_API_KEY"),
            "base_url": os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
        }
    ],
    "temperature": 0.7,
    "max_tokens": 4000,
}

# GPT-3.5 configuration for faster, cost-effective tasks
GPT35_CONFIG = {
    **BASE_CONFIG,
    "config_list": [
        {
            "model": "gpt-3.5-turbo",
            "api_key": os.getenv("OPENAI_API_KEY"),
            "base_url": os.getenv("OPENAI_API_BASE", "https://api.openai.com/v1"),
        }
    ],
    "temperature": 0.7,
    "max_tokens": 2000,
}

def get_agent_config(agent_type: str) -> Dict[str, Any]:
    """
    Get the configuration for a specific agent type
    """
    if agent_type in ["supervisor", "narrative"]:
        return GPT4_CONFIG
    return GPT35_CONFIG 