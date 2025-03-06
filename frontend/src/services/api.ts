import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

export interface AnalysisData {
  query: string;
  dataset: Record<string, any>;
}

export interface TokenUsage {
  total: number;
  remaining: number;
}

export interface AnalysisResponse {
  status: string;
  analysis: Record<string, any>;
  visualizations: {
    plots: Array<{
      type: string;
      column?: string;
      name?: string;
      plot_data: string;
    }>;
    summary: string[];
    recommendations: string[];
  };
  narrative: {
    executive_summary: string;
    key_findings: string[];
    business_implications: string[];
    recommendations: string[];
    visualization_insights: Array<{
      type: string;
      column?: string;
      name?: string;
      insight: string;
    }>;
    next_steps: string[];
  };
  qa_review: {
    validation_status: string;
    quality_checks: Array<{
      aspect: string;
      status: 'passed' | 'warning' | 'failed';
      comments: string;
    }>;
    improvement_suggestions: string[];
    clarity_score: number;
    accuracy_score: number;
    actionability_score: number;
  };
  warnings?: string[];
  message: string;
  error?: string;
  token_usage?: TokenUsage;
}

export const analyzeData = async (data: AnalysisData): Promise<AnalysisResponse> => {
  try {
    const response = await axios.post<AnalysisResponse>(
      `${API_BASE_URL}/analysis/analyze`,
      data
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Analysis failed');
    }
    throw new Error('Failed to analyze data');
  }
};

export const getTokenUsage = async (): Promise<TokenUsage> => {
  try {
    const response = await axios.get<{ remaining_tokens: number }>(
      `${API_BASE_URL}/analysis/token-usage`
    );
    return {
      total: 0, // This will be calculated based on the limit
      remaining: response.data.remaining_tokens,
    };
  } catch (error) {
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data.detail || 'Failed to fetch token usage');
    }
    throw new Error('Failed to fetch token usage');
  }
}; 