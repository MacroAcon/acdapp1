from typing import Dict, Any, Optional
import autogen
from abc import ABC, abstractmethod
import os

class BaseAgent(ABC):
    def __init__(
        self,
        name: str,
        model: str,
        system_message: str,
        temperature: float = 0.7,
        max_tokens: Optional[int] = None
    ):
        self.name = name
        self.model = model
        self.system_message = system_message
        self.temperature = temperature
        self.max_tokens = max_tokens
        self.config = self._create_config()
        self.agent = self._initialize_agent()

    def _create_config(self) -> Dict[str, Any]:
        """Create the configuration for the agent."""
        return {
            "temperature": self.temperature,
            "max_tokens": self.max_tokens,
            "model": self.model,
            "api_key": os.getenv("OPENAI_API_KEY")
        }

    def _initialize_agent(self) -> autogen.AssistantAgent:
        """Initialize the AutoGen agent with the configuration."""
        return autogen.AssistantAgent(
            name=self.name,
            system_message=self.system_message,
            llm_config={"config_list": [self.config]}
        )

    @abstractmethod
    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the input data and return results."""
        pass

    async def _track_token_usage(self, response: Any) -> None:
        """Track token usage for cost estimation."""
        # Implementation for token tracking will go here
        pass 