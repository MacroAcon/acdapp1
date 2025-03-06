from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

# OpenAI API Configuration
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
if not OPENAI_API_KEY:
    raise ValueError("OPENAI_API_KEY environment variable is not set")

# Agent Model Configurations
AGENT_CONFIGS: Dict[str, Dict[str, Any]] = {
    "supervisor": {
        "model": "gpt-4-turbo-preview",
        "temperature": 0.7,
        "max_tokens": 1000,
        "role": "You are a senior data analyst and project manager. Your role is to oversee the analysis workflow, "
               "delegate tasks to specialized agents, and ensure the final output meets business requirements."
    },
    "data_analyst": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.3,
        "max_tokens": 800,
        "role": "You are a data analysis specialist. Your role is to process datasets, identify patterns, "
               "calculate statistics, and extract meaningful insights from the data."
    },
    "visualizer": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.3,
        "max_tokens": 800,
        "role": "You are a data visualization expert. Your role is to create clear, informative charts and graphs "
               "that effectively communicate data insights using Plotly."
    },
    "narrator": {
        "model": "gpt-4-turbo-preview",
        "temperature": 0.7,
        "max_tokens": 1000,
        "role": "You are a business communication expert. Your role is to convert technical findings into "
               "clear, actionable business insights using professional language."
    },
    "qa": {
        "model": "gpt-3.5-turbo",
        "temperature": 0.3,
        "max_tokens": 500,
        "role": "You are a quality assurance specialist. Your role is to review analysis outputs for accuracy, "
               "clarity, and professionalism before they are presented to users."
    }
}

# Token Usage Limits
DAILY_TOKEN_LIMIT = 100000  # Adjust based on your OpenAI API plan
TOKEN_COST_PER_1K = {
    "gpt-4-turbo-preview": 0.01,  # $0.01 per 1K tokens for input
    "gpt-3.5-turbo": 0.0005,      # $0.0005 per 1K tokens for input
}

# Analysis Settings
MAX_DATASET_SIZE = 1000000  # Maximum number of rows allowed for analysis
SUPPORTED_FILE_TYPES = [".csv", ".xlsx", ".json"] 