from typing import Dict, Any
import pandas as pd
import numpy as np
from .base_agent import BaseAgent

class DataAnalysisAgent(BaseAgent):
    def __init__(self):
        super().__init__(
            name="DataAnalyst",
            model="gpt-3.5-turbo",  # Using the more cost-efficient model for data analysis
            system_message="""You are an expert data analyst AI agent. Your role is to:
            1. Analyze datasets thoroughly and identify key patterns
            2. Generate statistical insights and metrics
            3. Identify business-relevant trends and anomalies
            4. Prepare data summaries for visualization
            Always ensure your analysis is accurate and business-relevant.""",
            temperature=0.3  # Lower temperature for more consistent analytical results
        )

    async def process(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Process the input data and generate analytical insights."""
        try:
            # Convert input data to pandas DataFrame if it's not already
            df = pd.DataFrame(input_data["data"]) if isinstance(input_data["data"], list) else input_data["data"]
            
            # Basic statistical analysis
            stats = {
                "summary": df.describe().to_dict(),
                "missing_values": df.isnull().sum().to_dict(),
                "correlation": df.corr().to_dict() if df.select_dtypes(include=[np.number]).columns.any() else None
            }

            # Generate prompts for the AI agent
            analysis_prompt = f"""
            Analyze the following dataset metrics and provide insights:
            1. Basic Statistics: {stats['summary']}
            2. Missing Values: {stats['missing_values']}
            3. Correlations: {stats['correlation']}
            
            Consider the user's query: {input_data.get('query', 'Provide general insights')}
            """

            # Get AI insights
            response = await self.agent.generate_response(analysis_prompt)
            await self._track_token_usage(response)

            return {
                "statistics": stats,
                "insights": response.content,
                "status": "success"
            }

        except Exception as e:
            return {
                "status": "error",
                "message": str(e)
            }

    async def preprocess_data(self, df: pd.DataFrame) -> pd.DataFrame:
        """Preprocess the data for analysis."""
        # Handle missing values
        df = df.fillna(df.mean()) if df.select_dtypes(include=[np.number]).columns.any() else df.fillna("unknown")
        
        # Convert datetime columns
        for col in df.columns:
            if df[col].dtype == 'object':
                try:
                    df[col] = pd.to_datetime(df[col])
                except:
                    pass
        
        return df 