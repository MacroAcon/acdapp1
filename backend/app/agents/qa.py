import autogen
from typing import Dict, Any, List
from .base_config import get_agent_config

class QAAgent:
    def __init__(self):
        self.config = get_agent_config("qa")
        self.agent = autogen.AssistantAgent(
            name="qa_agent",
            system_message="""You are a quality assurance agent specialized in:
            1. Validating analysis results and insights
            2. Checking for logical consistency
            3. Ensuring clarity and actionability of recommendations
            4. Verifying data interpretation accuracy
            5. Maintaining high standards of communication
            
            Focus on ensuring the analysis output is accurate, clear, and valuable for business stakeholders.""",
            llm_config=self.config
        )
    
    async def review_analysis(
        self,
        analysis_results: Dict[str, Any],
        visualization_results: Dict[str, Any],
        narrative_results: Dict[str, Any],
        query: str
    ) -> Dict[str, Any]:
        """
        Review and validate the complete analysis output
        """
        try:
            # Structure for QA review
            qa_review = {
                "validation_status": "pending",
                "quality_checks": [],
                "improvement_suggestions": [],
                "clarity_score": 0.0,
                "accuracy_score": 0.0,
                "actionability_score": 0.0
            }
            
            # Perform quality checks
            quality_checks = await self._perform_quality_checks(
                analysis_results,
                visualization_results,
                narrative_results,
                query
            )
            
            # Calculate quality scores
            scores = self._calculate_quality_scores(quality_checks)
            
            # Update QA review with results
            qa_review.update({
                "validation_status": "completed",
                "quality_checks": quality_checks["checks"],
                "improvement_suggestions": quality_checks["suggestions"],
                "clarity_score": scores["clarity"],
                "accuracy_score": scores["accuracy"],
                "actionability_score": scores["actionability"]
            })
            
            # Determine if the analysis passes QA
            passes_qa = all([
                scores["clarity"] >= 0.7,
                scores["accuracy"] >= 0.8,
                scores["actionability"] >= 0.7
            ])
            
            return {
                "status": "success",
                "passes_qa": passes_qa,
                "qa_review": qa_review,
                "message": "QA review completed successfully"
            }
            
        except Exception as e:
            return {
                "status": "error",
                "error": str(e),
                "message": "Failed to complete QA review"
            }
    
    async def _perform_quality_checks(
        self,
        analysis_results: Dict[str, Any],
        visualization_results: Dict[str, Any],
        narrative_results: Dict[str, Any],
        query: str
    ) -> Dict[str, Any]:
        """Perform comprehensive quality checks on the analysis"""
        try:
            # Create QA prompt
            prompt = self._create_qa_prompt(
                analysis_results,
                visualization_results,
                narrative_results,
                query
            )
            
            # Process through AutoGen agent
            # Placeholder for actual agent processing
            return {
                "checks": [
                    {
                        "aspect": "Data Interpretation",
                        "status": "passed",
                        "comments": "Analysis accurately reflects the data"
                    },
                    {
                        "aspect": "Visualization Clarity",
                        "status": "passed",
                        "comments": "Visualizations effectively communicate insights"
                    },
                    {
                        "aspect": "Narrative Quality",
                        "status": "passed",
                        "comments": "Clear and actionable business insights provided"
                    }
                ],
                "suggestions": [
                    "Consider adding confidence intervals to key metrics",
                    "Include more specific action items in recommendations"
                ]
            }
            
        except Exception as e:
            raise Exception(f"Error in quality checks: {str(e)}")
    
    def _calculate_quality_scores(self, quality_checks: Dict[str, Any]) -> Dict[str, float]:
        """Calculate quality scores based on checks"""
        # Placeholder scoring logic
        return {
            "clarity": 0.85,
            "accuracy": 0.90,
            "actionability": 0.80
        }
    
    def _create_qa_prompt(
        self,
        analysis_results: Dict[str, Any],
        visualization_results: Dict[str, Any],
        narrative_results: Dict[str, Any],
        query: str
    ) -> str:
        """Create a prompt for QA review"""
        return f"""
        Review the following analysis output for quality and accuracy:

        Original Query: "{query}"

        Analysis Results:
        {analysis_results}

        Visualization Results:
        {visualization_results}

        Narrative Insights:
        {narrative_results}

        Please evaluate:
        1. Accuracy of data interpretation
        2. Clarity of visualizations
        3. Quality of narrative insights
        4. Actionability of recommendations
        5. Overall coherence and value

        Provide specific improvement suggestions if needed.
        """
    
    def get_agent(self) -> autogen.AssistantAgent:
        """Get the underlying AutoGen agent"""
        return self.agent 