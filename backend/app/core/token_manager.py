from typing import Dict, Any
from datetime import datetime, timedelta
import os
from dotenv import load_dotenv

load_dotenv()

class TokenManager:
    def __init__(self):
        self.daily_limit = int(os.getenv("DAILY_TOKEN_LIMIT", "10000"))  # Default 10k tokens per day
        self.current_usage = 0
        self.last_reset = datetime.now()
        self.usage_history: Dict[str, int] = {}  # Track usage by agent type

    def reset_if_needed(self):
        """Reset daily usage if a new day has started"""
        now = datetime.now()
        if (now - self.last_reset).days >= 1:
            self.current_usage = 0
            self.usage_history = {}
            self.last_reset = now

    def can_proceed(self, estimated_tokens: int) -> bool:
        """Check if the operation can proceed within token limits"""
        self.reset_if_needed()
        return (self.current_usage + estimated_tokens) <= self.daily_limit

    def record_usage(self, agent_type: str, tokens: int):
        """Record token usage for an agent"""
        self.current_usage += tokens
        self.usage_history[agent_type] = self.usage_history.get(agent_type, 0) + tokens

    def get_usage_stats(self) -> Dict[str, Any]:
        """Get current usage statistics"""
        self.reset_if_needed()
        return {
            "current_usage": self.current_usage,
            "daily_limit": self.daily_limit,
            "remaining_tokens": self.daily_limit - self.current_usage,
            "usage_by_agent": self.usage_history,
            "last_reset": self.last_reset.isoformat()
        }

    def estimate_tokens(self, text: str) -> int:
        """Estimate token count for a given text"""
        # Rough estimation: 1 token ≈ 4 characters
        return len(text) // 4

# Global token manager instance
token_manager = TokenManager() 