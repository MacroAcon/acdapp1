from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class DatasetBase(BaseModel):
    name: str
    description: str
    type: str
    size: int
    columns: Optional[List[str]] = None
    preview: Optional[List[Dict[str, Any]]] = None
    lastUpdated: str

class DatasetCreate(DatasetBase):
    pass

class Dataset(DatasetBase):
    id: str

    class Config:
        from_attributes = True

class DatasetResponse(Dataset):
    pass 