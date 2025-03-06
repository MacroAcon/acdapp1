import os
import kaggle
from kaggle.api.kaggle_api_extended import KaggleApi
from typing import List, Dict, Any, Optional
import pandas as pd
from datetime import datetime

class KaggleService:
    def __init__(self):
        self.api = KaggleApi()
        self.api.authenticate()
        self.max_file_size = 100 * 1024 * 1024  # 100MB limit

    def search_datasets(self, query: str, max_results: int = 10) -> List[Dict[str, Any]]:
        """
        Search for datasets on Kaggle
        """
        try:
            datasets = self.api.dataset_list(search=query, max_size=self.max_file_size, sort_by='hottest')
            return [
                {
                    'id': dataset.ref,
                    'title': dataset.title,
                    'description': dataset.description,
                    'size': dataset.size,
                    'lastUpdated': dataset.lastUpdated,
                    'downloadCount': dataset.downloadCount,
                    'fileCount': dataset.fileCount,
                }
                for dataset in datasets[:max_results]
            ]
        except Exception as e:
            raise Exception(f"Failed to search datasets: {str(e)}")

    def download_dataset(self, dataset_ref: str) -> Dict[str, Any]:
        """
        Download a dataset from Kaggle
        """
        try:
            # Get dataset metadata
            dataset = self.api.dataset_get(dataset_ref)
            
            # Check if dataset is too large
            if dataset.size > self.max_file_size:
                raise Exception(f"Dataset too large. Maximum size is {self.max_file_size / (1024*1024)}MB")

            # Download the dataset
            self.api.dataset_download_files(dataset_ref, path='temp', unzip=True)
            
            # Read the first CSV file (assuming it's the main dataset)
            csv_files = [f for f in os.listdir('temp') if f.endswith('.csv')]
            if not csv_files:
                raise Exception("No CSV files found in dataset")

            df = pd.read_csv(os.path.join('temp', csv_files[0]))
            
            # Create dataset metadata
            dataset_info = {
                'name': dataset.title,
                'description': dataset.description,
                'type': 'csv',
                'size': os.path.getsize(os.path.join('temp', csv_files[0])),
                'columns': list(df.columns),
                'preview': df.head().to_dict(orient='records'),
                'lastUpdated': datetime.now().isoformat()
            }

            # Clean up
            for file in os.listdir('temp'):
                os.remove(os.path.join('temp', file))
            os.rmdir('temp')

            return dataset_info

        except Exception as e:
            # Clean up on error
            if os.path.exists('temp'):
                for file in os.listdir('temp'):
                    os.remove(os.path.join('temp', file))
                os.rmdir('temp')
            raise Exception(f"Failed to download dataset: {str(e)}")

# Global instance
kaggle_service = KaggleService() 