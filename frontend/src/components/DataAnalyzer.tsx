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
import { useUI } from '../contexts/UIContext';

const DataAnalyzer: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const { isAgentMode } = useUI();
  
  const analysisMutation = useMutation<AnalysisResponse, Error, AnalysisData>({
    mutationFn: analyzeData,
    onError: (error: Error) => {
      console.error('Analysis error:', error);
      setError(error.message || 'An error occurred during analysis');
    },
  });

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name);
      setFile(file);
      setError(null);
    }
  };

  const handleQueryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuery = e.target.value;
    console.log('Query updated:', newQuery);
    setQuery(newQuery);
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('Please upload a file first');
      return;
    }

    if (!query.trim()) {
      setError('Please enter an analysis query');
      return;
    }

    try {
      console.log('Starting analysis...');
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          console.log('File parsed successfully');
          const analysisData: AnalysisData = {
            query: query.trim(),
            dataset: {
              id: file.name,
              name: file.name,
              type: file.type || 'json',
              data: data
            }
          };
          console.log('Sending analysis request:', analysisData);
          analysisMutation.mutate(analysisData);
        } catch (err) {
          console.error('JSON parsing error:', err);
          setError('Invalid JSON file format');
        }
      };
      reader.onerror = (err) => {
        console.error('File reading error:', err);
        setError('Error reading file');
      };
      reader.readAsText(file);
    } catch (err) {
      console.error('General error:', err);
      setError('Error reading file');
    }
  };

  return (
    <Card 
      variant="outlined"
      sx={isAgentMode ? {
        border: '2px solid #00FFB2',
        '& [data-agent]': {
          outline: '1px solid rgba(0, 255, 178, 0.3)',
          outlineOffset: '2px',
        }
      } : undefined}
    >
      <CardContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <Box data-agent="file-upload">
            <Button
              variant="contained"
              component="label"
              startIcon={<UploadIcon />}
              fullWidth
              data-agent-action="upload"
              data-agent-type="json"
            >
              {isAgentMode ? 'DATA_UPLOAD_JSON' : 'Upload Dataset (JSON)'}
              <input
                type="file"
                hidden
                accept=".json"
                onChange={handleFileUpload}
                data-agent-input="file"
              />
            </Button>
            {file && (
              <Typography 
                variant="body2" 
                sx={{ mt: 1, color: 'text.secondary' }}
                data-agent="file-name"
              >
                {isAgentMode ? `SELECTED_FILE=${file.name}` : `Selected file: ${file.name}`}
              </Typography>
            )}
          </Box>

          <TextField
            label={isAgentMode ? 'QUERY_INPUT' : 'Analysis Query'}
            placeholder={isAgentMode ? 'ENTER_ANALYSIS_QUERY' : 'E.g., What are the key trends in this dataset?'}
            multiline
            rows={2}
            value={query}
            onChange={handleQueryChange}
            fullWidth
            disabled={analysisMutation.isPending}
            error={!query.trim() && error !== null}
            helperText={!query.trim() && error !== null ? (isAgentMode ? 'QUERY_REQUIRED' : 'Query is required') : ''}
            data-agent="query-input"
            data-agent-type="text"
            sx={isAgentMode ? {
              '& .MuiOutlinedInput-root': {
                fontFamily: 'monospace',
              }
            } : undefined}
          />

          <Button
            variant="contained"
            color="primary"
            onClick={handleAnalyze}
            disabled={!file || !query.trim() || analysisMutation.isPending}
            startIcon={
              analysisMutation.isPending ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                <AnalyticsIcon />
              )
            }
            data-agent="analyze-button"
            data-agent-action="analyze"
          >
            {analysisMutation.isPending 
              ? (isAgentMode ? 'ANALYZING_IN_PROGRESS' : 'Analyzing...') 
              : (isAgentMode ? 'EXECUTE_ANALYSIS' : 'Analyze Data')}
          </Button>

          {error && (
            <Alert 
              severity="error" 
              onClose={() => setError(null)}
              data-agent="error-message"
              data-agent-type="error"
            >
              {isAgentMode ? `ERROR: ${error}` : error}
            </Alert>
          )}

          {analysisMutation.data && (
            <AnalysisResults 
              results={analysisMutation.data}
              isAgentMode={isAgentMode}
            />
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default DataAnalyzer; 