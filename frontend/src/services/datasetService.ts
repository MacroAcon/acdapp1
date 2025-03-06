import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface Dataset {
  id: string;
  name: string;
  description: string;
  type: 'csv' | 'json' | 'excel';
  size: number;
  columns?: string[];
  preview?: Record<string, any>[];
  lastUpdated: string;
}

export interface KaggleDataset {
  id: string;
  title: string;
  description: string;
  size: number;
  lastUpdated: string;
  downloadCount: number;
  fileCount: number;
}

export interface UploadResponse {
  dataset: Dataset;
  message: string;
}

const datasetService = {
  async uploadDataset(file: File): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await axios.post(`${API_BASE_URL}/api/datasets/upload`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  async getDatasets(): Promise<Dataset[]> {
    const response = await axios.get(`${API_BASE_URL}/api/datasets`);
    return response.data;
  },

  async getDataset(id: string): Promise<Dataset> {
    const response = await axios.get(`${API_BASE_URL}/api/datasets/${id}`);
    return response.data;
  },

  async deleteDataset(id: string): Promise<void> {
    await axios.delete(`${API_BASE_URL}/api/datasets/${id}`);
  },

  async searchKaggleDatasets(query: string, maxResults: number = 10): Promise<KaggleDataset[]> {
    const response = await axios.get(`${API_BASE_URL}/api/datasets/kaggle/search`, {
      params: { 
        query, 
        max_results: maxResults,
        file_type: 'csv'
      }
    });
    return response.data;
  },

  async downloadKaggleDataset(datasetRef: string): Promise<Dataset> {
    const response = await axios.post(`${API_BASE_URL}/api/datasets/kaggle/download/${datasetRef}`);
    return response.data;
  }
};

// React Query hooks
export const useDatasets = () => {
  const queryClient = useQueryClient();

  const datasets = useQuery({
    queryKey: ['datasets'],
    queryFn: datasetService.getDatasets,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const uploadDataset = useMutation({
    mutationFn: datasetService.uploadDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const deleteDataset = useMutation({
    mutationFn: datasetService.deleteDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  const downloadKaggleDataset = useMutation({
    mutationFn: datasetService.downloadKaggleDataset,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
    },
  });

  return {
    datasets,
    uploadDataset,
    deleteDataset,
    downloadKaggleDataset,
  };
};

export const useDataset = (id: string) => {
  return useQuery({
    queryKey: ['datasets', id],
    queryFn: () => datasetService.getDataset(id),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};

export const useSearchKaggleDatasets = (query: string, maxResults: number = 10) => {
  return useQuery({
    queryKey: ['kaggle-datasets', query, maxResults],
    queryFn: () => datasetService.searchKaggleDatasets(query, maxResults),
    enabled: !!query,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 