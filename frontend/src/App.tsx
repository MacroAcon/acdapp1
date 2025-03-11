import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material';
import Layout from './components/Layout/Layout';
import { Upload } from './components/Upload/Upload';
import { Analysis } from './components/Analysis/Analysis';
import { Usage } from './components/Usage/Usage';
import { AboutMe } from './components/AboutMe/AboutMe';
import { UIProvider } from './contexts/UIContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00FFB2', // Cyber green
      light: '#33FFC4',
      dark: '#00CC8E',
    },
    secondary: {
      main: '#FF00E5', // Neon pink
      light: '#FF33EB',
      dark: '#CC00B7',
    },
    background: {
      default: '#080C14', // Deep space blue
      paper: '#111827',
    },
    text: {
      primary: '#E2E8F0',
      secondary: '#94A3B8',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      '"Roboto"',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      background: 'linear-gradient(135deg, #00FFB2 0%, #00CC8E 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      letterSpacing: '-0.025em',
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(0, 255, 178, 0.1)',
          boxShadow: '0 8px 32px rgba(0, 255, 178, 0.1)',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '12px 24px',
          borderRadius: 12,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
        },
        contained: {
          background: 'linear-gradient(135deg, #00FFB2 0%, #00CC8E 100%)',
          color: '#080C14',
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            background: 'linear-gradient(135deg, #33FFC4 0%, #00FFB2 100%)',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            background: 'rgba(255, 255, 255, 0.03)',
            border: '1px solid rgba(0, 255, 178, 0.1)',
            transition: 'all 0.3s ease',
            '&:hover': {
              border: '1px solid rgba(0, 255, 178, 0.2)',
              background: 'rgba(255, 255, 255, 0.05)',
            },
            '&.Mui-focused': {
              border: '1px solid rgba(0, 255, 178, 0.3)',
              boxShadow: '0 0 0 4px rgba(0, 255, 178, 0.1)',
            },
          },
        },
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <UIProvider>
          <Router>
            <Layout>
              <Routes>
                <Route path="/upload" element={<Upload />} />
                <Route path="/analysis" element={<Analysis />} />
                <Route path="/usage" element={<Usage />} />
                <Route path="/about" element={<AboutMe />} />
                <Route path="/" element={<Navigate to="/upload" replace />} />
              </Routes>
            </Layout>
          </Router>
        </UIProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
