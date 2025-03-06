import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import {
  Card,
  CardContent,
  Typography,
  LinearProgress,
  Box,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import { useAnalysis } from '../services/analysisService';

export const TokenUsage: React.FC = () => {
  const queryClient = useQueryClient();
  const analysis = useAnalysis(queryClient);
  const { data: usage, isLoading } = useQuery({
    queryKey: ['tokenUsage'],
    queryFn: () => analysis.getTokenUsage(),
    refetchInterval: 60000, // Refresh every minute
  });

  if (isLoading || !usage) {
    return (
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Token Usage
          </Typography>
          <LinearProgress />
        </CardContent>
      </Card>
    );
  }

  const usagePercentage = (usage.current_usage / usage.daily_limit) * 100;

  return (
    <Card>
      <CardContent>
        <Typography variant="h6" gutterBottom>
          Token Usage
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Daily Usage: {usage.current_usage.toLocaleString()} / {usage.daily_limit.toLocaleString()} tokens
          </Typography>
          <LinearProgress 
            variant="determinate" 
            value={usagePercentage} 
            sx={{ 
              height: 8, 
              borderRadius: 4,
              backgroundColor: '#e0e0e0',
              '& .MuiLinearProgress-bar': {
                backgroundColor: usagePercentage > 90 ? '#f44336' : '#1976d2',
              }
            }} 
          />
        </Box>

        <Typography variant="subtitle2" gutterBottom>
          Usage by Agent
        </Typography>
        <List dense>
          {Object.entries(usage.usage_by_agent).map(([agent, tokens]) => (
            <ListItem key={agent}>
              <ListItemText
                primary={agent}
                secondary={`${tokens.toLocaleString()} tokens`}
              />
            </ListItem>
          ))}
        </List>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
          Last reset: {new Date(usage.last_reset).toLocaleString()}
        </Typography>
      </CardContent>
    </Card>
  );
}; 