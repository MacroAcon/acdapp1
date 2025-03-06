import React from 'react';
import {
  Card,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Chip,
  Stack,
} from '@mui/material';
import {
  TrendingUp,
  Lightbulb,
  Business,
  Assignment,
  NavigateNext,
} from '@mui/icons-material';

interface NarrativeInsight {
  executive_summary: string;
  key_findings: string[];
  business_implications: string[];
  recommendations: string[];
  visualization_insights: Array<{
    type: string;
    column?: string;
    name?: string;
    insight: string;
  }>;
  next_steps: string[];
}

interface NarrativeInsightsProps {
  insights: NarrativeInsight;
  isLoading?: boolean;
}

const NarrativeInsights: React.FC<NarrativeInsightsProps> = ({
  insights,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <Card>
        <CardContent>
          <Typography>Loading insights...</Typography>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={3}>
      {/* Executive Summary */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h5" gutterBottom color="primary">
            Executive Summary
          </Typography>
          <Typography variant="body1" paragraph>
            {insights.executive_summary}
          </Typography>
        </CardContent>
      </Card>

      {/* Key Findings */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <TrendingUp color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Key Findings</Typography>
          </Box>
          <List>
            {insights.key_findings.map((finding, index) => (
              <ListItem key={index}>
                <ListItemText primary={finding} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Business Implications */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Business color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Business Implications</Typography>
          </Box>
          <List>
            {insights.business_implications.map((implication, index) => (
              <ListItem key={index}>
                <ListItemText primary={implication} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <Lightbulb color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Recommendations</Typography>
          </Box>
          <List>
            {insights.recommendations.map((recommendation, index) => (
              <ListItem key={index}>
                <ListItemText primary={recommendation} />
              </ListItem>
            ))}
          </List>
        </CardContent>
      </Card>

      {/* Visualization Insights */}
      <Card elevation={2}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Visualization Insights
          </Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
            {insights.visualization_insights.map((viz, index) => (
              <Chip
                key={index}
                label={viz.insight}
                color="primary"
                variant="outlined"
              />
            ))}
          </Stack>
        </CardContent>
      </Card>

      {/* Next Steps */}
      <Card elevation={2}>
        <CardContent>
          <Box display="flex" alignItems="center" mb={2}>
            <NavigateNext color="primary" sx={{ mr: 1 }} />
            <Typography variant="h6">Next Steps</Typography>
          </Box>
          <List>
            {insights.next_steps.map((step, index) => (
              <React.Fragment key={index}>
                <ListItem>
                  <ListItemText
                    primary={`${index + 1}. ${step}`}
                    sx={{ '& .MuiTypography-root': { fontWeight: 500 } }}
                  />
                </ListItem>
                {index < insights.next_steps.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </CardContent>
      </Card>
    </Stack>
  );
};

export default NarrativeInsights; 