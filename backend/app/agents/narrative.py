import autogen
from typing import Dict, Any, List
from .base_config import get_agent_config

class NarrativeInsightsAgent:
    def __init__(self):
        self.config = get_agent_config("narrative")
        self.agent = autogen.AssistantAgent(
            name="narrative_insights",
            system_message="""You are a narrative insights agent specialized in:
            1. Converting technical analysis into business-friendly insights
            2. Identifying key business implications
            3. Providing actionable recommendations
            4. Crafting compelling data stories
            5. Highlighting strategic opportunities
            
            Focus on delivering clear, actionable insights that business stakeholders can understand and act upon.""",
            llm_config=self.config
        )
    
    async def generate_insights(
        self,
        analysis_results: Dict[str, Any],
        visualization_results: Dict[str, Any],
        query: str
    ) -> Dict[str, Any]:
        """
        Generate narrative insights from analysis and visualization results
        """
        try:
            # Structure for narrative insights
            narrative = {
                "executive_summary": "",
                "key_findings": [],
                "business_implications": [],
                "recommendations": [],
                "visualization_insights": [],
                "next_steps": []
            }
            
            # Extract key statistics and findings
            stats = analysis_results.get("summary_stats", {})
            numeric_summary = stats.get("numeric_summary", {})
            
            # Process visualization insights
            viz_plots = visualization_results.get("plots", [])
            viz_insights = []
            
            for plot in viz_plots:
                plot_type = plot.get("type")
                if plot_type == "distribution":
                    viz_insights.append({
                        "type": "distribution",
                        "column": plot.get("column"),
                        "insight": f"Distribution analysis of {plot.get('column')}"
                    })
                elif plot_type == "bar":
                    viz_insights.append({
                        "type": "categorical",
                        "column": plot.get("column"),
                        "insight": f"Category breakdown of {plot.get('column')}"
                    })
                elif plot_type == "heatmap":
                    viz_insights.append({
                        "type": "correlation",
                        "name": plot.get("name"),
                        "insight": "Correlation analysis between numeric features"
                    })
            
            # Generate narrative content using AutoGen
            prompt = self._create_narrative_prompt(
                query,
                analysis_results,
                viz_insights
            )
            
            # Process the narrative through the agent
            response = await self._process_narrative(prompt)
            
            # Update narrative structure with generated content
            narrative.update({
                "executive_summary": response.get("executive_summary", ""),
                "key_findings": response.get("key_findings", []),
                "business_implications": response.get("business_implications", []),
                "recommendations": response.get("recommendations", []),
                "visualization_insights": viz_insights,
                "next_steps": response.get("next_steps", [])
            })
            
            return {
                "status": "success",
                "narrative": narrative,
                "message": "Narrative insights generated successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "message": "Failed to generate narrative insights"
            }
    
    async def _process_narrative(self, prompt: str) -> Dict[str, Any]:
        """Process the narrative through the AutoGen agent"""
        try:
            # Placeholder for actual AutoGen processing
            # This would typically involve sending the prompt to the agent
            # and receiving a structured response
            return {
                "executive_summary": "Analysis reveals significant patterns in the data...",
                "key_findings": [
                    "Finding 1: Key trend identified",
                    "Finding 2: Notable correlation discovered"
                ],
                "business_implications": [
                    "Implication 1: Potential revenue impact",
                    "Implication 2: Operational efficiency opportunity"
                ],
                "recommendations": [
                    "Recommendation 1: Strategic action item",
                    "Recommendation 2: Process improvement suggestion"
                ],
                "next_steps": [
                    "Step 1: Detailed investigation of key findings",
                    "Step 2: Implementation planning"
                ]
            }
        except Exception as e:
            raise Exception(f"Error in narrative processing: {str(e)}")
    
    def _create_narrative_prompt(
        self,
        query: str,
        analysis_results: Dict[str, Any],
        viz_insights: List[Dict[str, Any]]
    ) -> str:
        """Create a prompt for generating narrative insights"""
        return f"""
        Based on the following analysis and visualization results,
        provide business-friendly insights for the query: "{query}"

        Analysis Results:
        {analysis_results}

        Visualization Insights:
        {viz_insights}

        Please provide:
        1. An executive summary of the findings
        2. Key insights and patterns discovered
        3. Business implications and opportunities
        4. Actionable recommendations
        5. Suggested next steps

        Focus on business value and actionable insights.
        """
    
    def get_agent(self) -> autogen.AssistantAgent:
        """Get the underlying AutoGen agent"""
        return self.agent 