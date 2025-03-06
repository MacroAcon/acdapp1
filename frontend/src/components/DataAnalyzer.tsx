import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import {
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
  Alert,
} from '@mui/material';
import { UploadFile as UploadIcon, Analytics as AnalyticsIcon } from '@mui/icons-material';
import { analyzeData, AnalysisData, AnalysisResponse } from '../services/api';
import AnalysisResults from './AnalysisResults';

const DataAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  const analysisMutation = useMutation<AnalysisResponse, Error, AnalysisData>({
    mutationFn: analyzeData,
    onError: (error: Error) => {
      setError(error.message || 'An error occurred during analysis');
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setFile(file);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a file first');
      return;
    }

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          const analysisData: AnalysisData = {
            query: query.trim(),
            dataset: {
              id: file.name,
              name: file.name,
              type: file.type || 'json',
              data: data
            }
          };
          analysisMutation.mutate(analysisData);
        } catch (err) {
          setError('Invalid JSON file format');
        }
      };
      reader.readAsText(file);
    } catch (err) {
      setError('Error reading file');
    }
  };

  return (
    <Card variant="outlined">
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box>
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
            >
              Upload Dataset (JSON)
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleFileUpload}
              />
            </Button>
            {file && (
              <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
                Selected file: {file.name}
              </Typography>
            )}
          </Box>

          <TextField
            label="Analysis Query"
            placeholder="E.g., What are the key trends in this dataset?"
            multiline
            rows={2}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            fullWidth
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
            disabled={!file || analysisMutation.isPending}
            startIcon={
              analysisMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AnalyticsIcon />
              )
            }
          >
            Analyze Data
          </Button>

          {error && (
            <Alert severity="error" onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {analysisMutation.data && (
            <AnalysisResults results={analysisMutation.data} />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataAnalyzer; 