from typing import Dict, Any, Optional
import openai
from .base_config import get_agent_config
from ..core.token_manager import token_manager

class BaseAgent:
    def __init__(self, agent_type: str):
        self.config = get_agent_config(agent_type)
        self.agent_type = agent_type
        self.model = self.config["config_list"][0]["model"]
        self.temperature = self.config["temperature"]
        self.role = self.config.get("system_message", "")
        self.conversation_history = []

    async def _call_openai(self, messages: list, temperature: Optional[float] = None) -> Dict[str, Any]:
        """Make an API call to OpenAI with token management."""
        try:
            # Estimate tokens for the request
            estimated_tokens = sum(token_manager.estimate_tokens(msg["content"]) for msg in messages)
            
            # Check if we can proceed
            if not token_manager.can_proceed(estimated_tokens):
                raise Exception("Token limit exceeded for today")
            
            response = await openai.ChatCompletion.acreate(
                model=self.model,
                messages=messages,
                temperature=temperature or self.temperature,
                **self.config
            )
            
            # Record token usage
            token_manager.record_usage(self.agent_type, response.usage.total_tokens)
            
            return {
                "content": response.choices[0].message.content,
                "token_usage": response.usage.total_tokens,
                "model": self.model
            }
        except Exception as e:
            raise Exception(f"OpenAI API error in {self.agent_type} agent: {str(e)}")

    async def process(self, input_data: Dict[str, Any], system_message: Optional[str] = None) -> Dict[str, Any]:
        """Process input data using the agent's role and configuration."""
        messages = [
            {"role": "system", "content": system_message or self.role},
            {"role": "user", "content": str(input_data)}
        ]
        
        # Add relevant conversation history if it exists
        if self.conversation_history:
            messages[1:1] = self.conversation_history[-5:]  # Include last 5 messages for context
        
        response = await self._call_openai(messages)
        
        # Update conversation history
        self.conversation_history.extend([
            {"role": "user", "content": str(input_data)},
            {"role": "assistant", "content": response["content"]}
        ])
        
        return response

    def clear_history(self):
        """Clear the conversation history."""
        self.conversation_history = [] 