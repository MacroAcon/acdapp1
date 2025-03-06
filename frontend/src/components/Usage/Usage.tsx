import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  CircularProgress,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area,
} from 'recharts';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

interface UsageData {
  daily: {
    date: string;
    tokens: number;
    cost: number;
  }[];
  monthly: {
    month: string;
    tokens: number;
    cost: number;
  }[];
  summary: {
    totalTokens: number;
    totalCost: number;
    averageDailyTokens: number;
    averageDailyCost: number;
  };
}

export const Usage: React.FC = () => {
  const { data, isLoading, error } = useQuery<UsageData>({
    queryKey: ['usage'],
    queryFn: async () => {
      const response = await axios.get('/api/usage');
      return response.data;
    },
  });

  if (isLoading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Typography color="error" variant="h6" align="center">
        Error loading usage data. Please try again later.
      </Typography>
    );
  }

  if (!data) {
    return (
      <Typography variant="h6" align="center">
        No usage data available.
      </Typography>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Token Usage Analytics
      </Typography>

      <Grid container spacing={3}>
        {/* Summary Cards */}
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Tokens
              </Typography>
              <Typography variant="h4">
                {data.summary.totalTokens.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Total Cost
              </Typography>
              <Typography variant="h4">
                ${data.summary.totalCost.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg. Daily Tokens
              </Typography>
              <Typography variant="h4">
                {data.summary.averageDailyTokens.toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Avg. Daily Cost
              </Typography>
              <Typography variant="h4">
                ${data.summary.averageDailyCost.toFixed(2)}
              </Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Daily Usage Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Daily Token Usage
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={data.daily}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis yAxisId="left" />
                    <YAxis yAxisId="right" orientation="right" />
                    <Tooltip />
                    <Legend />
                    <Line
                      yAxisId="left"
                      type="monotone"
                      dataKey="tokens"
                      stroke="#8884d8"
                      name="Tokens"
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="cost"
                      stroke="#82ca9d"
                      name="Cost ($)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Monthly Usage Chart */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Monthly Token Usage
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={data.monthly}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="tokens"
                      stackId="1"
                      stroke="#8884d8"
                      fill="#8884d8"
                      name="Tokens"
                    />
                    <Area
                      type="monotone"
                      dataKey="cost"
                      stackId="2"
                      stroke="#82ca9d"
                      fill="#82ca9d"
                      name="Cost ($)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 