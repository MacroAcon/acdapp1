import React from 'react';
import Plot from 'react-plotly.js';
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Box,
  CircularProgress,
} from '@mui/material';

interface PlotData {
  type: string;
  column?: string;
  name?: string;
  plot_data: string;
}

interface VisualizationData {
  plots: PlotData[];
  summary: string[];
  recommendations: string[];
}

interface DataVisualizationProps {
  visualizations: VisualizationData;
  query: string;
}

export const DataVisualization: React.FC<DataVisualizationProps> = ({
  visualizations,
  query,
}) => {
  const renderPlot = (plotData: PlotData) => {
    try {
      const parsedData = JSON.parse(plotData.plot_data);
      return (
        <Plot
          data={parsedData.data}
          layout={{
            ...parsedData.layout,
            autosize: true,
            height: 400,
            width: undefined,
            margin: { l: 50, r: 50, t: 50, b: 50 },
          }}
          useResizeHandler={true}
          style={{ width: '100%', height: '100%' }}
        />
      );
    } catch (error) {
      console.error('Error rendering plot:', error);
      return (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          height={400}
        >
          <Typography color="error">
            Error rendering visualization
          </Typography>
        </Box>
      );
    }
  };

  if (!visualizations || !visualizations.plots) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight={400}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" gutterBottom>
        Data Visualizations for: {query}
      </Typography>
      <Grid container spacing={3}>
        {visualizations.plots.map((plot, index) => (
          <Grid item xs={12} md={6} key={index}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" gutterBottom>
                  {plot.name || plot.column || `Visualization ${index + 1}`}
                </Typography>
                {renderPlot(plot)}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}; 