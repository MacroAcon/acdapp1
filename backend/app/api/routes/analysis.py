from fastapi import APIRouter, HTTPException, UploadFile, File, Depends
from typing import Dict, Any, List, Optional
import pandas as pd
import json
from ...agents.data_analyst import DataAnalystAgent
from ...agents.visualizer import VisualizerAgent
from ...core.token_manager import TokenManager
from ...agents.config import MAX_DATASET_SIZE, SUPPORTED_FILE_TYPES

router = APIRouter()
token_manager = TokenManager()
data_analyst = DataAnalystAgent()
visualizer = VisualizerAgent()

@router.post("/analyze")
async def analyze_data(
    file: UploadFile = File(...),
    query: Optional[str] = None
) -> Dict[str, Any]:
    """
    Analyze uploaded data file and generate insights.
    """
    # Validate file type
    file_extension = file.filename.lower().split('.')[-1]
    if f".{file_extension}" not in SUPPORTED_FILE_TYPES:
        raise HTTPException(
            status_code=400,
            detail=f"Unsupported file type. Supported types: {', '.join(SUPPORTED_FILE_TYPES)}"
        )
    
    try:
        # Read the file
        content = await file.read()
        if file_extension == "csv":
            df = pd.read_csv(pd.io.common.BytesIO(content))
        elif file_extension == "xlsx":
            df = pd.read_excel(pd.io.common.BytesIO(content))
        elif file_extension == "json":
            df = pd.read_json(pd.io.common.BytesIO(content))
        
        # Validate dataset size
        if len(df) > MAX_DATASET_SIZE:
            raise HTTPException(
                status_code=400,
                detail=f"Dataset too large. Maximum allowed size: {MAX_DATASET_SIZE} rows"
            )
        
        # Convert DataFrame to list of dictionaries
        data = df.to_dict('records')
        
        # Estimate token usage (rough estimate based on data size and complexity)
        estimated_tokens = len(str(data)) // 4  # Rough estimate: 4 characters per token
        
        # Check token limit
        if not token_manager.can_make_request(estimated_tokens):
            raise HTTPException(
                status_code=429,
                detail="Daily token limit exceeded. Please try again tomorrow."
            )
        
        # Perform analysis
        analysis_results = await data_analyst.analyze_dataset(data, query or "Provide a general analysis of this dataset")
        
        # Generate visualizations
        viz_results = await visualizer.create_visualizations(data, analysis_results)
        
        # Record token usage
        total_tokens = (
            analysis_results["token_usage"] +
            viz_results["token_usage"]
        )
        token_manager.record_usage(total_tokens, data_analyst.model)
        
        # Calculate cost
        estimated_cost = token_manager.estimate_cost(total_tokens, data_analyst.model)
        
        # Get current usage stats
        usage_stats = token_manager.get_usage_stats()
        
        return {
            "statistics": analysis_results["statistics"],
            "insights": analysis_results["insights"],
            "visualizations": viz_results["charts"],
            "viz_suggestions": viz_results["suggestions"],
            "token_usage": usage_stats,
            "estimated_cost": estimated_cost
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error processing data: {str(e)}"
        )

@router.get("/usage")
async def get_token_usage() -> Dict[str, Any]:
    """
    Get current token usage statistics.
    """
    try:
        usage_stats = token_manager.get_usage_stats()
        usage_history = token_manager.get_usage_history()
        
        return {
            "current_usage": usage_stats,
            "usage_history": usage_history
        }
        
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching token usage: {str(e)}"
        ) 