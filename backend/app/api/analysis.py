from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any
from pydantic import BaseModel
from ..agents.supervisor import SupervisorAgent
from ..core.token_manager import token_manager

router = APIRouter()
supervisor = SupervisorAgent()

class AnalysisRequest(BaseModel):
    query: str
    dataset: Dict[str, Any]

class AnalysisResponse(BaseModel):
    status: str
    analysis: Dict[str, Any]
    visualizations: Dict[str, Any]
    narrative: str
    qa_review: Dict[str, Any]
    warnings: list[str]
    token_usage: Dict[str, Any]

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(request: AnalysisRequest):
    """
    Analyze a dataset based on the user's query using our AI agent workflow.
    """
    try:
        # Get current token usage stats
        token_stats = token_manager.get_usage_stats()
        
        # Check if we can proceed with the analysis
        estimated_tokens = token_manager.estimate_tokens(str(request.query) + str(request.dataset))
        if not token_manager.can_proceed(estimated_tokens):
            raise HTTPException(
                status_code=429,
                detail="Daily token limit exceeded. Please try again tomorrow."
            )
        
        # Perform the analysis
        results = await supervisor.initiate_analysis(request.query, request.dataset)
        
        if results["status"] != "success":
            raise HTTPException(
                status_code=500,
                detail=results.get("error", "Analysis failed")
            )
        
        # Get updated token usage stats
        updated_token_stats = token_manager.get_usage_stats()
        
        return AnalysisResponse(
            status="success",
            analysis=results["analysis"],
            visualizations=results["visualizations"],
            narrative=results["narrative"],
            qa_review=results["qa_review"],
            warnings=results.get("warnings", []),
            token_usage=updated_token_stats
        )
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/token-usage")
async def get_token_usage():
    """
    Get current token usage statistics.
    """
    return token_manager.get_usage_stats() 