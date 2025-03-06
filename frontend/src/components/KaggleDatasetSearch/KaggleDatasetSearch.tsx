import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip,
} from '@mui/material';
import { Download as DownloadIcon } from '@mui/icons-material';
import { useSearchKaggleDatasets, useDatasets } from '../../services/datasetService';

export const KaggleDatasetSearch: React.FC = () => {
  const { downloadKaggleDataset } = useDatasets();
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [downloadDialogOpen, setDownloadDialogOpen] = useState(false);
  const [selectedDataset, setSelectedDataset] = useState<any>(null);

  const { data: datasets, isLoading } = useSearchKaggleDatasets(query);

  const handleDownload = async () => {
    if (!selectedDataset) return;

    try {
      await downloadKaggleDataset.mutateAsync(selectedDataset.ref);
      setDownloadDialogOpen(false);
      setSelectedDataset(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to download dataset');
    }
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Search Kaggle Datasets
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          Search for CSV datasets from Kaggle. Only CSV files will be shown in the results.
        </Typography>

        <TextField
          fullWidth
          label="Search Datasets"
          placeholder="Enter keywords to search for CSV datasets..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{ mb: 2 }}
        />

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List>
            {datasets?.map((dataset) => (
              <ListItem
                key={dataset.id}
                divider
                secondaryAction={
                  <Button
                    variant="outlined"
                    startIcon={<DownloadIcon />}
                    onClick={() => {
                      setSelectedDataset(dataset);
                      setDownloadDialogOpen(true);
                    }}
                    disabled={downloadKaggleDataset.isPending}
                  >
                    Download
                  </Button>
                }
              >
                <ListItemText
                  primary={dataset.title}
                  secondary={
                    <Box>
                      <Typography variant="body2" color="text.secondary">
                        {dataset.description}
                      </Typography>
                      <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                        <Chip 
                          label="CSV" 
                          size="small" 
                          color="primary" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${(dataset.size / 1024 / 1024).toFixed(2)} MB`} 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={`${dataset.downloadCount.toLocaleString()} downloads`} 
                          size="small" 
                          variant="outlined"
                        />
                      </Box>
                    </Box>
                  }
                />
              </ListItem>
            ))}
          </List>
        )}

        <Dialog open={downloadDialogOpen} onClose={() => setDownloadDialogOpen(false)}>
          <DialogTitle>Download Dataset</DialogTitle>
          <DialogContent>
            <Typography>
              Are you sure you want to download "{selectedDataset?.title}"?
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDownloadDialogOpen(false)}>Cancel</Button>
            <Button
              onClick={handleDownload}
              variant="contained"
              disabled={downloadKaggleDataset.isPending}
            >
              {downloadKaggleDataset.isPending ? (
                <CircularProgress size={20} />
              ) : (
                'Download'
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}; 