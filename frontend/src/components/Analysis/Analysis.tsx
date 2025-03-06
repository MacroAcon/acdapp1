import React, { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Alert,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import { useAnalysis, AnalysisRequest } from '../../services/analysisService';
import { Dataset } from '../../services/datasetService';
import { TokenUsage } from '../TokenUsage';
import AnalysisResults from '../AnalysisResults';
import { DatasetUpload } from '../DatasetUpload/DatasetUpload';

export const Analysis: React.FC = () => {
  const queryClient = useQueryClient();
  const analysis = useAnalysis(queryClient);
  const [query, setQuery] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [selectedDataset, setSelectedDataset] = useState<Dataset | undefined>(undefined);

  const handleAnalyze = async () => {
    if (!query.trim()) {
      setError('Please enter a query');
      return;
    }

    if (!selectedDataset) {
      setError('Please select a dataset');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      const request: AnalysisRequest = {
        query,
        dataset: selectedDataset,
      };

      const results = await analysis.analyzeData(request);
      setAnalysisResults(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Dataset Selection */}
        <Grid item xs={12} md={4}>
          <DatasetUpload
            onSelectDataset={setSelectedDataset}
            selectedDataset={selectedDataset}
          />
        </Grid>

        {/* Analysis Section */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h5" gutterBottom>
              Data Analysis
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Enter your analysis query"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="e.g., How can we improve warehouse efficiency?"
                disabled={isAnalyzing || !selectedDataset}
              />
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={isAnalyzing || !query.trim() || !selectedDataset}
                sx={{ minWidth: 120 }}
              >
                {isAnalyzing ? <CircularProgress size={24} /> : 'Analyze'}
              </Button>
            </Box>
            {error && (
              <Alert severity="error" sx={{ mt: 2 }}>
                {error}
              </Alert>
            )}
          </Paper>

          {/* Token Usage */}
          <Box sx={{ mt: 3 }}>
            <TokenUsage />
          </Box>

          {/* Analysis Results */}
          <Box sx={{ mt: 3 }}>
            {analysisResults ? (
              <AnalysisResults results={analysisResults} />
            ) : (
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Analysis Results
                  </Typography>
                  <Typography color="text.secondary">
                    {selectedDataset
                      ? 'Enter a query and click Analyze to see results'
                      : 'Select a dataset to begin analysis'}
                  </Typography>
                </CardContent>
              </Card>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}; 