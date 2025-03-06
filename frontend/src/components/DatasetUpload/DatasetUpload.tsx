import React, { useCallback, useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { Delete as DeleteIcon, Upload as UploadIcon } from '@mui/icons-material';
import { useDatasets, Dataset } from '../../services/datasetService';

export const DatasetUpload: React.FC<{
  onSelectDataset: (dataset: Dataset | undefined) => void;
  selectedDataset?: Dataset;
}> = ({ onSelectDataset, selectedDataset }) => {
  const { datasets, uploadDataset, deleteDataset } = useDatasets();
  const [error, setError] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [datasetToDelete, setDatasetToDelete] = useState<Dataset | null>(null);

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      await uploadDataset.mutateAsync(file);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload dataset');
    }
  }, [uploadDataset]);

  const handleDelete = async () => {
    if (!datasetToDelete) return;

    try {
      await deleteDataset.mutateAsync(datasetToDelete.id);
      setDeleteDialogOpen(false);
      setDatasetToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete dataset');
    }
  };

  if (datasets.isLoading) {
    return (
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Datasets
        </Typography>
        <CircularProgress />
      </Paper>
    );
  }

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        Datasets
      </Typography>

      {/* Upload Button */}
      <Box sx={{ mb: 3 }}>
        <input
          accept=".csv,.json,.xlsx,.xls"
          style={{ display: 'none' }}
          id="dataset-upload"
          type="file"
          onChange={handleFileUpload}
          disabled={uploadDataset.isPending}
        />
        <label htmlFor="dataset-upload">
          <Button
            variant="contained"
            component="span"
            startIcon={uploadDataset.isPending ? <CircularProgress size={20} /> : <UploadIcon />}
            disabled={uploadDataset.isPending}
          >
            Upload Dataset
          </Button>
        </label>
      </Box>

      {/* Error Message */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {/* Dataset List */}
      <List>
        {datasets.data?.map((dataset: Dataset) => (
          <ListItem
            key={dataset.id}
            button
            selected={selectedDataset?.id === dataset.id}
            onClick={() => onSelectDataset(dataset)}
          >
            <ListItemText
              primary={dataset.name}
              secondary={`${dataset.type.toUpperCase()} • ${(dataset.size / 1024).toFixed(2)} KB`}
            />
            <ListItemSecondaryAction>
              <IconButton
                edge="end"
                aria-label="delete"
                onClick={(e) => {
                  e.stopPropagation();
                  setDatasetToDelete(dataset);
                  setDeleteDialogOpen(true);
                }}
              >
                <DeleteIcon />
              </IconButton>
            </ListItemSecondaryAction>
          </ListItem>
        ))}
      </List>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Delete Dataset</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{datasetToDelete?.name}"? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleDelete} 
            color="error"
            disabled={deleteDataset.isPending}
          >
            {deleteDataset.isPending ? <CircularProgress size={20} /> : 'Delete'}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}; 