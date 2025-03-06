import axios from 'axios';
import { QueryClient } from '@tanstack/react-query';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface AnalysisRequest {
  query: string;
  dataset: Record<string, any>;
}

export interface AnalysisResponse {
  status: string;
  analysis: Record<string, any>;
  visualizations: Record<string, any>;
  narrative: string;
  qa_review: Record<string, any>;
  warnings: string[];
  token_usage: {
    current_usage: number;
    daily_limit: number;
    remaining_tokens: number;
    usage_by_agent: Record<string, number>;
    last_reset: string;
  };
}

export interface TokenUsageStats {
  current_usage: number;
  daily_limit: number;
  remaining_tokens: number;
  usage_by_agent: Record<string, number>;
  last_reset: string;
}

const analysisService = {
  async analyzeData(request: AnalysisRequest): Promise<AnalysisResponse> {
    const response = await axios.post(`${API_BASE_URL}/api/analysis/analyze`, request);
    return response.data;
  },

  async getTokenUsage(): Promise<TokenUsageStats> {
    const response = await axios.get(`${API_BASE_URL}/api/analysis/token-usage`);
    return response.data;
  }
};

// React Query hooks
export const useAnalysis = (queryClient: QueryClient) => ({
  analyzeData: async (request: AnalysisRequest) => {
    return queryClient.fetchQuery({
      queryKey: ['analysis', request],
      queryFn: () => analysisService.analyzeData(request),
      staleTime: 5 * 60 * 1000, // 5 minutes
    });
  },
  getTokenUsage: async () => {
    return queryClient.fetchQuery({
      queryKey: ['tokenUsage'],
      queryFn: () => analysisService.getTokenUsage(),
      staleTime: 1 * 60 * 1000, // 1 minute
    });
  }
}); 