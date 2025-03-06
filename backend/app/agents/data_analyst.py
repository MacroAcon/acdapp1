import autogen
import pandas as pd
from typing import Dict, Any, List
from .base_config import get_agent_config

class DataAnalysisAgent:
    def __init__(self):
        self.config = get_agent_config("analyst")
        self.agent = autogen.AssistantAgent(
            name="data_analyst",
            system_message="""You are a data analysis agent specialized in:
            1. Processing and cleaning datasets
            2. Performing statistical analysis
            3. Identifying patterns and trends
            4. Extracting meaningful insights
            5. Preparing data for visualization
            
            You should focus on providing accurate, actionable insights that can drive business decisions.""",
            llm_config=self.config
        )
        
    async def analyze_dataset(self, dataset: Dict[str, Any], query: str) -> Dict[str, Any]:
        """
        Analyze a dataset based on the user's query
        """
        try:
            # Convert dataset to pandas DataFrame if it's not already
            df = pd.DataFrame(dataset["data"]) if isinstance(dataset.get("data"), list) else dataset["data"]
            
            # Basic analysis results structure
            analysis_results = {
                "summary_stats": {},
                "key_findings": [],
                "recommendations": [],
                "prepared_data": {}
            }
            
            # Perform basic statistical analysis
            if not df.empty:
                analysis_results["summary_stats"] = {
                    "numeric_summary": df.describe().to_dict(),
                    "missing_values": df.isnull().sum().to_dict(),
                    "column_types": df.dtypes.astype(str).to_dict()
                }
            
            return {
                "status": "success",
                "results": analysis_results,
                "message": "Analysis completed successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "message": "Failed to analyze dataset"
            }
    
    def get_agent(self) -> autogen.AssistantAgent:
        """
        Get the underlying AutoGen agent
        """
        return self.agent 