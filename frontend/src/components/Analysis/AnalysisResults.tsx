import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Typography,
  Alert,
  CircularProgress,
  Container,
} from '@mui/material';
import {
  Analytics,
  Assessment,
  QueryStats,
  VerifiedUser,
} from '@mui/icons-material';
import NarrativeInsights from './NarrativeInsights';
import QAReview from './QAReview';
import { DataVisualization } from './DataVisualization';
import { analyzeData, AnalysisResponse, AnalysisData } from '../../services/api';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface TokenUsage {
  total: number;
  remaining: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => (
  <div
    role="tabpanel"
    hidden={value !== index}
    id={`analysis-tabpanel-${index}`}
    aria-labelledby={`analysis-tab-${index}`}
  >
    {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
  </div>
);

interface AnalysisResultsProps {
  query: string;
  dataset: Record<string, any>;
  onError?: (error: Error) => void;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({
  query,
  dataset,
  onError,
}) => {
  const [activeTab, setActiveTab] = React.useState(0);

  const {
    data: analysisResults,
    isLoading,
    error,
  } = useQuery<AnalysisResponse, Error, AnalysisResponse>({
    queryKey: ['analysis', query, dataset],
    queryFn: () => analyzeData({ query, dataset }),
    enabled: !!query && !!dataset,
    retry: 1,
  });

  React.useEffect(() => {
    if (error && onError) {
      onError(error);
    }
  }, [error, onError]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  if (isLoading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error">
        An error occurred while analyzing the data. Please try again.
      </Alert>
    );
  }

  if (!analysisResults) {
    return null;
  }

  return (
    <Container maxWidth="lg">
      <Paper elevation={3}>
        {/* Token Usage Warning */}
        {analysisResults.token_usage && (
          <Box p={2}>
            <Alert severity="info">
              Token Usage: {analysisResults.token_usage.total} (
              {analysisResults.token_usage.remaining} remaining)
            </Alert>
          </Box>
        )}

        {/* Analysis Warnings */}
        {analysisResults.warnings && analysisResults.warnings.length > 0 && (
          <Box p={2}>
            <Alert severity="warning">
              <Typography variant="subtitle2" gutterBottom>
                Analysis Warnings:
              </Typography>
              <ul>
                {analysisResults.warnings.map((warning, index) => (
                  <li key={index}>{warning}</li>
                ))}
              </ul>
            </Alert>
          </Box>
        )}

        {/* Analysis Tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            aria-label="analysis results tabs"
            variant="fullWidth"
          >
            <Tab
              icon={<Assessment />}
              label="Insights"
              id="analysis-tab-0"
              aria-controls="analysis-tabpanel-0"
            />
            <Tab
              icon={<QueryStats />}
              label="Visualizations"
              id="analysis-tab-1"
              aria-controls="analysis-tabpanel-1"
            />
            <Tab
              icon={<Analytics />}
              label="Analysis"
              id="analysis-tab-2"
              aria-controls="analysis-tabpanel-2"
            />
            <Tab
              icon={<VerifiedUser />}
              label="QA Review"
              id="analysis-tab-3"
              aria-controls="analysis-tabpanel-3"
            />
          </Tabs>
        </Box>

        {/* Tab Panels */}
        <TabPanel value={activeTab} index={0}>
          <NarrativeInsights insights={analysisResults.narrative} />
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <DataVisualization
            visualizations={analysisResults.visualizations}
            query={query}
          />
        </TabPanel>

        <TabPanel value={activeTab} index={2}>
          <Box>
            <Typography variant="h6" gutterBottom>
              Technical Analysis
            </Typography>
            <pre
              style={{
                backgroundColor: '#f5f5f5',
                padding: '1rem',
                borderRadius: '4px',
                overflow: 'auto',
              }}
            >
              {JSON.stringify(analysisResults.analysis, null, 2)}
            </pre>
          </Box>
        </TabPanel>

        <TabPanel value={activeTab} index={3}>
          <QAReview review={analysisResults.qa_review} />
        </TabPanel>
      </Paper>
    </Container>
  );
};

export default AnalysisResults; 