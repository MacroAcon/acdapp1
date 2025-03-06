import { AnalysisData, AnalysisResponse, TokenUsage } from '../api';

// Mock data that mimics real responses
const MOCK_ANALYSIS_RESPONSE: AnalysisResponse = {
  status: 'success',
  analysis: {
    summary_stats: {
      numeric_summary: {
        sales: { mean: 1000, std: 200, min: 500, max: 1500 },
        profit: { mean: 300, std: 50, min: 150, max: 450 },
      },
      missing_values: { sales: 0, profit: 2 },
    },
  },
  visualizations: {
    plots: [
      {
        type: 'distribution',
        column: 'sales',
        name: 'Sales Distribution',
        plot_data: JSON.stringify({
          data: [{ type: 'histogram', x: [/* mock data points */] }],
          layout: { title: 'Sales Distribution' },
        }),
      },
      {
        type: 'bar',
        column: 'category',
        name: 'Sales by Category',
        plot_data: JSON.stringify({
          data: [{ type: 'bar', x: ['A', 'B', 'C'], y: [10, 20, 30] }],
          layout: { title: 'Sales by Category' },
        }),
      },
    ],
    summary: ['Distribution shows normal pattern', 'Clear seasonal trends'],
    recommendations: ['Focus on high-performing categories'],
  },
  narrative: {
    executive_summary: 'Analysis shows strong performance in key areas...',
    key_findings: [
      'Sales show positive trend',
      'Category A leads in performance',
    ],
    business_implications: [
      'Market share likely to increase',
      'Opportunity for expansion',
    ],
    recommendations: [
      'Invest in Category A',
      'Optimize inventory levels',
    ],
    visualization_insights: [
      {
        type: 'trend',
        insight: 'Upward trend in sales performance',
      },
    ],
    next_steps: [
      'Detailed category analysis',
      'Customer segment review',
    ],
  },
  qa_review: {
    validation_status: 'completed',
    quality_checks: [
      {
        aspect: 'Data Completeness',
        status: 'passed',
        comments: 'All required data present',
      },
      {
        aspect: 'Analysis Depth',
        status: 'passed',
        comments: 'Comprehensive analysis performed',
      },
    ],
    improvement_suggestions: [
      'Consider adding confidence intervals',
    ],
    clarity_score: 0.85,
    accuracy_score: 0.90,
    actionability_score: 0.88,
  },
  message: 'Analysis completed successfully',
  token_usage: {
    total: 1000,
    remaining: 9000,
  },
};

// Mock API functions
export const analyzeData = async (data: AnalysisData): Promise<AnalysisResponse> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // You could add logic here to generate different responses based on the input
  return {
    ...MOCK_ANALYSIS_RESPONSE,
    // Add query-specific content
    narrative: {
      ...MOCK_ANALYSIS_RESPONSE.narrative,
      executive_summary: `Analysis of "${data.query}" shows strong performance...`,
    },
  };
};

export const getTokenUsage = async (): Promise<TokenUsage> => {
  await new Promise(resolve => setTimeout(resolve, 500));
  return {
    total: 1000,
    remaining: 9000,
  };
}; 