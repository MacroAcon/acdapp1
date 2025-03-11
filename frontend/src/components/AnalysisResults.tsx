import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Divider,
  Grid,
  Alert,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { AnalysisResponse } from '../services/api';

interface AnalysisResultsProps {
  results: AnalysisResponse;
  isAgentMode?: boolean;
}

const AnalysisResults: React.FC<AnalysisResultsProps> = ({ results, isAgentMode = false }) => {
  const { analysis, visualizations, narrative, qa_review, warnings } = results;

  return (
    <Box>
      {/* Warnings */}
      {warnings && warnings.length > 0 && (
        <Alert severity="warning" sx={{ mb: 2 }}>
          {warnings.map((warning, index) => (
            <Typography key={index} variant="body2">
              • {warning}
            </Typography>
          ))}
        </Alert>
      )}

      {/* Narrative Insights */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {isAgentMode ? 'NARRATIVE_INSIGHTS' : 'Key Insights'}
          </Typography>
          <Typography variant="body1" paragraph>
            {narrative.executive_summary}
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {isAgentMode ? 'KEY_FINDINGS' : 'Key Findings'}
            </Typography>
            {narrative.key_findings.map((finding, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, mb: 1 }}>
                • {finding}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {isAgentMode ? 'BUSINESS_IMPLICATIONS' : 'Business Implications'}
            </Typography>
            {narrative.business_implications.map((implication, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, mb: 1 }}>
                • {implication}
              </Typography>
            ))}
          </Box>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              {isAgentMode ? 'RECOMMENDATIONS' : 'Recommendations'}
            </Typography>
            {narrative.recommendations.map((recommendation, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, mb: 1 }}>
                • {recommendation}
              </Typography>
            ))}
          </Box>
        </CardContent>
      </Card>

      {/* Analysis Details */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {isAgentMode ? 'DETAILED_ANALYSIS' : 'Detailed Analysis'}
          </Typography>
          {Object.entries(analysis).map(([key, value]) => (
            <Box key={key} sx={{ mb: 2 }}>
              <Typography variant="subtitle1" color="primary">
                {isAgentMode ? `ANALYSIS_${key.toUpperCase()}` : key}
              </Typography>
              <Typography variant="body2">
                {typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
              </Typography>
            </Box>
          ))}
        </CardContent>
      </Card>

      {/* Visualizations */}
      <Grid container spacing={3}>
        {visualizations.plots.map((plot, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {isAgentMode ? `VISUALIZATION_${index + 1}` : (plot.name || `Visualization ${index + 1}`)}
                </Typography>
                <Box sx={{ height: 300 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={JSON.parse(plot.plot_data).data[0].y}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#00FFB2" />
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* QA Review */}
      <Card sx={{ mt: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {isAgentMode ? 'QA_REVIEW' : 'Quality Assurance Review'}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              {isAgentMode ? 'VALIDATION_STATUS' : 'Validation Status'}
            </Typography>
            <Typography variant="body2">
              {qa_review.validation_status}
            </Typography>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              {isAgentMode ? 'QUALITY_CHECKS' : 'Quality Checks'}
            </Typography>
            {qa_review.quality_checks.map((check, index) => (
              <Box key={index} sx={{ ml: 2, mb: 1 }}>
                <Typography variant="body2">
                  • {check.aspect}: {check.status} - {check.comments}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" color="primary">
              {isAgentMode ? 'IMPROVEMENT_SUGGESTIONS' : 'Improvement Suggestions'}
            </Typography>
            {qa_review.improvement_suggestions.map((suggestion, index) => (
              <Typography key={index} variant="body2" sx={{ ml: 2, mb: 1 }}>
                • {suggestion}
              </Typography>
            ))}
          </Box>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Typography variant="body2">
              {isAgentMode ? `CLARITY_SCORE=${qa_review.clarity_score}` : `Clarity Score: ${qa_review.clarity_score}`}
            </Typography>
            <Typography variant="body2">
              {isAgentMode ? `ACCURACY_SCORE=${qa_review.accuracy_score}` : `Accuracy Score: ${qa_review.accuracy_score}`}
            </Typography>
            <Typography variant="body2">
              {isAgentMode ? `ACTIONABILITY_SCORE=${qa_review.actionability_score}` : `Actionability Score: ${qa_review.actionability_score}`}
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default AnalysisResults; 