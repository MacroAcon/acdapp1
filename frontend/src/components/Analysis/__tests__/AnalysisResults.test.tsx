import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import AnalysisResults from '../AnalysisResults';
import * as api from '../../../services/api';
import { act } from 'react-dom/test-utils';
import { renderWithProviders } from '../../../test-utils';

// Mock the API module
jest.mock('../../../services/api', () => ({
  analyzeData: jest.fn(),
}));

const mockAnalyzeData = api.analyzeData as jest.Mock;

describe('AnalysisResults', () => {
  const mockProps = {
    query: 'Analyze sales trends',
    dataset: {
      sales: [1000, 1200],
      profit: [300, 350],
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockAnalyzeData.mockResolvedValue({
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
        plots: [],
        summary: ['Distribution shows normal pattern'],
        recommendations: ['Focus on high-performing categories'],
      },
      narrative: {
        executive_summary: 'Analysis shows strong performance',
        key_findings: ['Sales show positive trend'],
        business_implications: ['Market share likely to increase'],
        recommendations: ['Invest in Category A'],
        visualization_insights: [],
        next_steps: ['Detailed category analysis'],
      },
      qa_review: {
        validation_status: 'completed',
        quality_checks: [],
        improvement_suggestions: [],
        clarity_score: 0.85,
        accuracy_score: 0.90,
        actionability_score: 0.88,
      },
      message: 'Analysis completed successfully',
      token_usage: {
        total: 1000,
        remaining: 9000,
      },
    });
  });

  it('shows loading state initially', async () => {
    renderWithProviders(<AnalysisResults {...mockProps} />);
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  it('displays analysis results when data is loaded', async () => {
    renderWithProviders(<AnalysisResults {...mockProps} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Check for tab labels
    expect(screen.getByText('Insights')).toBeInTheDocument();
    expect(screen.getByText('Visualizations')).toBeInTheDocument();
    expect(screen.getByText('Analysis')).toBeInTheDocument();
    expect(screen.getByText('QA Review')).toBeInTheDocument();

    // Check for token usage info
    expect(screen.getByText(/Token Usage: 1000 \(9000 remaining\)/i)).toBeInTheDocument();
  });

  it('displays error message when analysis fails', async () => {
    const mockError = new Error('Analysis failed');
    mockAnalyzeData.mockRejectedValueOnce(mockError);

    const onError = jest.fn();
    renderWithProviders(<AnalysisResults {...mockProps} onError={onError} />);

    // Wait for error message to appear
    await waitFor(() => {
      expect(screen.getByText(/An error occurred while analyzing the data/i)).toBeInTheDocument();
      expect(onError).toHaveBeenCalledWith(mockError);
    });
  });

  it('allows navigation between different tabs', async () => {
    renderWithProviders(<AnalysisResults {...mockProps} />);

    // Wait for loading to complete
    await waitFor(() => {
      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    // Navigate to Visualizations tab
    const visualizationsTab = screen.getByRole('tab', { name: /visualizations/i });
    await act(async () => {
      await userEvent.click(visualizationsTab);
    });

    // Wait for visualizations content to appear
    await waitFor(() => {
      expect(screen.getByText(/Data Visualizations for:/i)).toBeInTheDocument();
    });

    // Navigate to Analysis tab
    const analysisTab = screen.getByRole('tab', { name: /analysis/i });
    await act(async () => {
      await userEvent.click(analysisTab);
    });

    // Wait for analysis content to appear
    await waitFor(() => {
      expect(screen.getByText(/Technical Analysis/i)).toBeInTheDocument();
    });
  });

  it('displays token usage information', async () => {
    renderWithProviders(<AnalysisResults {...mockProps} />);

    // Wait for token usage info to appear
    await waitFor(() => {
      expect(screen.getByText(/Token Usage: 1000 \(9000 remaining\)/i)).toBeInTheDocument();
    });
  });

  it('shows warning when token usage is high', async () => {
    mockAnalyzeData.mockResolvedValueOnce({
      ...await mockAnalyzeData(),
      token_usage: {
        total: 8000,
        remaining: 2000,
      },
      warnings: ['Token usage is high. Consider optimizing your query.'],
    });

    renderWithProviders(<AnalysisResults {...mockProps} />);

    // Wait for warning to appear
    await waitFor(() => {
      expect(screen.getByText(/Analysis Warnings/i)).toBeInTheDocument();
      expect(screen.getByText(/Token usage is high/i)).toBeInTheDocument();
    });
  });
});