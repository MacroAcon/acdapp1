from typing import Dict, Any, List
import autogen
from .base_config import get_agent_config
from .data_analyst import DataAnalysisAgent
from .visualizer import VisualizationAgent
from .narrative import NarrativeInsightsAgent
from .qa import QAAgent

class SupervisorAgent:
    def __init__(self):
        self.config = get_agent_config("supervisor")
        self.agent = autogen.AssistantAgent(
            name="supervisor",
            system_message="""You are the supervisor agent responsible for orchestrating the analysis workflow.
            Your role is to:
            1. Understand user queries and break them down into subtasks
            2. Delegate tasks to appropriate specialist agents
            3. Ensure quality and coherence of the final output
            4. Manage the overall analysis process
            5. Handle error cases and provide fallback solutions
            6. Optimize token usage across the workflow
            7. Ensure all insights are business-relevant and actionable""",
            llm_config=self.config,
            human_input_mode="NEVER",
            max_consecutive_auto_reply=5,
            is_termination_msg=lambda x: "TERMINATE" in x.get("content", ""),
        )
        
        # Initialize specialist agents
        self.data_analyst = DataAnalysisAgent()
        self.visualizer = VisualizationAgent()
        self.narrative = NarrativeInsightsAgent()
        self.qa = QAAgent()

    async def initiate_analysis(self, query: str, dataset: Dict[str, Any]) -> Dict[str, Any]:
        """
        Initiate the analysis workflow based on user query and selected dataset
        """
        try:
            # Step 1: Analyze the dataset
            analysis_results = await self.data_analyst.analyze_dataset(dataset, query)
            
            if analysis_results["status"] != "success":
                return {
                    "status": "error",
                    "message": "Data analysis failed",
                    "error": analysis_results.get("error", "Unknown error in data analysis")
                }
            
            # Step 2: Generate visualizations based on analysis
            viz_results = await self.visualizer.create_visualizations(
                analysis_results["results"],
                dataset
            )
            
            if viz_results["status"] != "success":
                return {
                    "status": "error",
                    "message": "Visualization generation failed",
                    "error": viz_results.get("error", "Unknown error in visualization")
                }
            
            # Step 3: Generate narrative insights
            narrative_results = await self.narrative.generate_insights(
                analysis_results["results"],
                viz_results["visualizations"],
                query
            )
            
            if narrative_results["status"] != "success":
                return {
                    "status": "error",
                    "message": "Narrative generation failed",
                    "error": narrative_results.get("error", "Unknown error in narrative generation")
                }
            
            # Step 4: Perform QA review
            qa_results = await self.qa.review_analysis(
                analysis_results["results"],
                viz_results["visualizations"],
                narrative_results["narrative"],
                query
            )
            
            if qa_results["status"] != "success":
                return {
                    "status": "error",
                    "message": "QA review failed",
                    "error": qa_results.get("error", "Unknown error in QA review")
                }
            
            # If QA fails, add warnings to the output
            qa_warnings = []
            if not qa_results["passes_qa"]:
                qa_warnings = [
                    "Quality check identified potential issues",
                    *qa_results["qa_review"]["improvement_suggestions"]
                ]
            
            # Combine all results
            return {
                "status": "success",
                "analysis": analysis_results["results"],
                "visualizations": viz_results["visualizations"],
                "narrative": narrative_results["narrative"],
                "qa_review": qa_results["qa_review"],
                "warnings": qa_warnings,
                "message": "Analysis workflow completed successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "message": "Analysis workflow failed",
                "error": str(e)
            }

    def get_agent(self) -> autogen.AssistantAgent:
        """
        Get the underlying AutoGen agent
        """
        return self.agent 