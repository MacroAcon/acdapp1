from fastapi import APIRouter, HTTPException, Depends
from typing import Dict, Any, Optional
from pydantic import BaseModel
from ...agents.supervisor import SupervisorAgent
from ...core.auth import get_current_user
from ...core.token_management import check_token_limit, update_token_usage

router = APIRouter(prefix="/analysis", tags=["analysis"])

class AnalysisRequest(BaseModel):
    query: str
    dataset: Dict[str, Any]
    options: Optional[Dict[str, Any]] = None

class AnalysisResponse(BaseModel):
    status: str
    analysis: Optional[Dict[str, Any]] = None
    visualizations: Optional[Dict[str, Any]] = None
    narrative: Optional[Dict[str, Any]] = None
    qa_review: Optional[Dict[str, Any]] = None
    warnings: Optional[list] = None
    message: str
    error: Optional[str] = None
    token_usage: Optional[Dict[str, int]] = None

@router.post("/analyze", response_model=AnalysisResponse)
async def analyze_data(
    request: AnalysisRequest,
    current_user: Dict = Depends(get_current_user)
) -> Dict[str, Any]:
    """
    Analyze a dataset using the AI agent workflow
    """
    try:
        # Check token usage limits
        if not check_token_limit(current_user["id"]):
            raise HTTPException(
                status_code=429,
                detail="Token usage limit exceeded. Please try again later."
            )
        
        # Initialize the supervisor agent
        supervisor = SupervisorAgent()
        
        # Run the analysis workflow
        results = await supervisor.initiate_analysis(
            query=request.query,
            dataset=request.dataset
        )
        
        # If analysis failed, raise an exception
        if results["status"] != "success":
            raise HTTPException(
                status_code=500,
                detail=results.get("error", "Analysis failed")
            )
        
        # Update token usage
        # Note: In a real implementation, we would track actual token usage
        estimated_tokens = len(str(results)) // 4  # Rough estimation
        await update_token_usage(current_user["id"], estimated_tokens)
        
        # Return the results
        return {
            **results,
            "token_usage": {
                "total": estimated_tokens,
                "remaining": await check_token_limit(current_user["id"], return_remaining=True)
            }
        }
        
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred during analysis: {str(e)}"
        )

@router.get("/token-usage", response_model=Dict[str, int])
async def get_token_usage(
    current_user: Dict = Depends(get_current_user)
) -> Dict[str, int]:
    """
    Get the current token usage statistics for the user
    """
    try:
        remaining_tokens = await check_token_limit(current_user["id"], return_remaining=True)
        return {
            "remaining_tokens": remaining_tokens
        }
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to fetch token usage: {str(e)}"
        ) 