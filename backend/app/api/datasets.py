from fastapi import APIRouter, UploadFile, File, HTTPException, Query
from typing import List, Optional
import pandas as pd
import json
import os
from datetime import datetime
from pydantic import BaseModel
from ..models.dataset import Dataset, DatasetCreate, DatasetResponse
from ..services.kaggle_service import kaggle_service

router = APIRouter()

# In-memory storage for datasets (replace with database in production)
DATASETS_DIR = "sample_data"
os.makedirs(DATASETS_DIR, exist_ok=True)

def get_dataset_path(dataset_id: str) -> str:
    return os.path.join(DATASETS_DIR, f"{dataset_id}.json")

@router.post("/upload", response_model=DatasetResponse)
async def upload_dataset(file: UploadFile = File(...)):
    """
    Upload a dataset file (CSV, JSON, or Excel)
    """
    try:
        # Read file content based on file type
        content = await file.read()
        file_extension = os.path.splitext(file.filename)[1].lower()
        
        if file_extension == '.csv':
            df = pd.read_csv(pd.io.common.BytesIO(content))
            data = df.to_dict(orient='records')
        elif file_extension == '.json':
            data = json.loads(content)
        elif file_extension in ['.xlsx', '.xls']:
            df = pd.read_excel(pd.io.common.BytesIO(content))
            data = df.to_dict(orient='records')
        else:
            raise HTTPException(
                status_code=400,
                detail="Unsupported file format. Please upload CSV, JSON, or Excel files."
            )

        # Create dataset metadata
        dataset = DatasetCreate(
            name=os.path.splitext(file.filename)[0],
            description=f"Uploaded {file_extension[1:].upper()} file",
            type=file_extension[1:],
            size=len(content),
            columns=list(data[0].keys()) if data else [],
            preview=data[:5] if data else [],
            lastUpdated=datetime.now().isoformat()
        )

        # Save dataset
        dataset_id = f"dataset_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        dataset_path = get_dataset_path(dataset_id)
        
        with open(dataset_path, 'w') as f:
            json.dump(dataset.dict(), f)

        return DatasetResponse(
            id=dataset_id,
            **dataset.dict()
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to process dataset: {str(e)}"
        )

@router.get("/kaggle/search")
async def search_kaggle_datasets(query: str = Query(..., min_length=1), max_results: int = Query(10, ge=1, le=50)):
    """
    Search for datasets on Kaggle
    """
    try:
        return kaggle_service.search_datasets(query, max_results)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.post("/kaggle/download/{dataset_ref}")
async def download_kaggle_dataset(dataset_ref: str):
    """
    Download a dataset from Kaggle
    """
    try:
        dataset_info = kaggle_service.download_dataset(dataset_ref)
        
        # Save dataset
        dataset_id = f"kaggle_{datetime.now().strftime('%Y%m%d_%H%M%S')}"
        dataset_path = get_dataset_path(dataset_id)
        
        with open(dataset_path, 'w') as f:
            json.dump(dataset_info, f)

        return DatasetResponse(
            id=dataset_id,
            **dataset_info
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e)
        )

@router.get("/", response_model=List[DatasetResponse])
async def get_datasets():
    """
    Get all available datasets
    """
    try:
        datasets = []
        for filename in os.listdir(DATASETS_DIR):
            if filename.endswith('.json'):
                with open(os.path.join(DATASETS_DIR, filename), 'r') as f:
                    data = json.load(f)
                    dataset_id = os.path.splitext(filename)[0]
                    datasets.append(DatasetResponse(id=dataset_id, **data))
        return datasets
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve datasets: {str(e)}"
        )

@router.get("/{dataset_id}", response_model=DatasetResponse)
async def get_dataset(dataset_id: str):
    """
    Get a specific dataset by ID
    """
    try:
        dataset_path = get_dataset_path(dataset_id)
        if not os.path.exists(dataset_path):
            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )
        
        with open(dataset_path, 'r') as f:
            data = json.load(f)
            return DatasetResponse(id=dataset_id, **data)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to retrieve dataset: {str(e)}"
        )

@router.delete("/{dataset_id}")
async def delete_dataset(dataset_id: str):
    """
    Delete a dataset by ID
    """
    try:
        dataset_path = get_dataset_path(dataset_id)
        if not os.path.exists(dataset_path):
            raise HTTPException(
                status_code=404,
                detail="Dataset not found"
            )
        
        os.remove(dataset_path)
        return {"message": "Dataset deleted successfully"}
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete dataset: {str(e)}"
        ) 