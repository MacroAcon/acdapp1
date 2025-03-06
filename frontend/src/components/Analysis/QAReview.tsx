import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Box,
  LinearProgress,
  Alert,
  Stack,
  Chip,
} from '@mui/material';
import {
  CheckCircle,
  Warning,
  Error,
  Info,
} from '@mui/icons-material';

interface QualityCheck {
  aspect: string;
  status: 'passed' | 'warning' | 'failed';
  comments: string;
}

interface QAReviewData {
  validation_status: string;
  quality_checks: QualityCheck[];
  improvement_suggestions: string[];
  clarity_score: number;
  accuracy_score: number;
  actionability_score: number;
}

interface QAReviewProps {
  review: QAReviewData;
  isLoading?: boolean;
}

const QAReview: React.FC<QAReviewProps> = ({
  review,
  isLoading = false,
}) => {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle color="success" />;
      case 'warning':
        return <Warning color="warning" />;
      case 'failed':
        return <Error color="error" />;
      default:
        return <Info color="info" />;
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return 'success';
    if (score >= 0.6) return 'warning';
    return 'error';
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading QA review...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Quality Scores */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quality Scores
          </Typography>
          <Stack spacing={2}>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Clarity</Typography>
                <Typography variant="body2">
                  {Math.round(review.clarity_score * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={review.clarity_score * 100}
                color={getScoreColor(review.clarity_score)}
              />
            </Box>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Accuracy</Typography>
                <Typography variant="body2">
                  {Math.round(review.accuracy_score * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={review.accuracy_score * 100}
                color={getScoreColor(review.accuracy_score)}
              />
            </Box>
            <Box>
              <Box display="flex" justifyContent="space-between" mb={1}>
                <Typography variant="body2">Actionability</Typography>
                <Typography variant="body2">
                  {Math.round(review.actionability_score * 100)}%
                </Typography>
              </Box>
              <LinearProgress
                variant="determinate"
                value={review.actionability_score * 100}
                color={getScoreColor(review.actionability_score)}
              />
            </Box>
          </Stack>
        </CardContent>
      </Card>

      {/* Quality Checks */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Quality Checks
          </Typography>
          <List>
            {review.quality_checks.map((check, index) => (
              <ListItem
                key={index}
                sx={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  py: 2,
                }}
              >
                <Box sx={{ mr: 2, mt: 0.5 }}>
                  {getStatusIcon(check.status)}
                </Box>
                <ListItemText
                  primary={check.aspect}
                  secondary={check.comments}
                  primaryTypographyProps={{
                    fontWeight: 500,
                    gutterBottom: true,
                  }}
                />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Improvement Suggestions */}
      {review.improvement_suggestions.length > 0 && (
        <Alert severity="info" variant="outlined">
          <Typography variant="subtitle1" gutterBottom>
            Suggestions for Improvement
          </Typography>
          <List dense>
            {review.improvement_suggestions.map((suggestion, index) => (
              <ListItem key={index}>
                <ListItemText primary={suggestion} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {/* Validation Status */}
      <Box display="flex" justifyContent="center">
        <Chip
          label={`Validation Status: ${review.validation_status}`}
          color={review.validation_status === 'completed' ? 'success' : 'warning'}
          variant="outlined"
        />
      </Box>
    </Stack>
  );
};

export default QAReview; 