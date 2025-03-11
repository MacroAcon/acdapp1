import React from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Avatar,
  Chip,
  Link,
} from '@mui/material';
import { useUI } from '../../contexts/UIContext';

export const AboutMe: React.FC = () => {
  const { isAgentMode } = useUI();

  return (
    <Box data-agent="about-section">
      <Typography 
        variant="h4" 
        gutterBottom
        sx={{
          background: 'linear-gradient(135deg, #00FFB2 0%, #00CC8E 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          fontWeight: 'bold',
          mb: 4,
        }}
        data-agent="section-title"
      >
        {isAgentMode ? 'DEVELOPER_PROFILE' : 'About Me'}
      </Typography>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Card
            sx={isAgentMode ? {
              border: '2px solid #00FFB2',
              '& [data-agent]': {
                outline: '1px solid rgba(0, 255, 178, 0.3)',
                outlineOffset: '2px',
              }
            } : undefined}
          >
            <CardContent>
              <Box data-agent="bio-section">
                <Typography variant="h6" gutterBottom>
                  {isAgentMode ? 'BIO_HEADING' : 'Bio'}
                </Typography>
                <Typography variant="body1" paragraph data-agent="bio-content">
                  {isAgentMode 
                    ? 'DEVELOPER_BIO=Your bio here'
                    : 'Your bio here'}
                </Typography>
              </Box>

              <Box mt={4} data-agent="skills-section">
                <Typography variant="h6" gutterBottom>
                  {isAgentMode ? 'SKILLS_HEADING' : 'Skills & Technologies'}
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                  {['React', 'TypeScript', 'Python', 'FastAPI', 'Material-UI'].map((skill) => (
                    <Chip
                      key={skill}
                      label={isAgentMode ? `SKILL=${skill}` : skill}
                      sx={{
                        background: 'linear-gradient(135deg, rgba(0, 255, 178, 0.1) 0%, rgba(0, 204, 142, 0.1) 100%)',
                        border: '1px solid rgba(0, 255, 178, 0.3)',
                        color: '#00FFB2',
                        '&:hover': {
                          background: 'linear-gradient(135deg, rgba(0, 255, 178, 0.2) 0%, rgba(0, 204, 142, 0.2) 100%)',
                        },
                      }}
                      data-agent="skill-chip"
                    />
                  ))}
                </Box>
              </Box>

              <Box mt={4} data-agent="projects-section">
                <Typography variant="h6" gutterBottom>
                  {isAgentMode ? 'PROJECTS_HEADING' : 'Featured Projects'}
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Card
                    variant="outlined"
                    sx={{
                      background: 'linear-gradient(135deg, rgba(17, 24, 39, 0.95) 0%, rgba(8, 12, 20, 0.95) 100%)',
                    }}
                    data-agent="project-card"
                  >
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {isAgentMode ? 'PROJECT_TITLE=AI Analytics Platform' : 'AI Analytics Platform'}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {isAgentMode 
                          ? 'PROJECT_DESCRIPTION=A modern analytics platform powered by AI'
                          : 'A modern analytics platform powered by AI'}
                      </Typography>
                    </CardContent>
                  </Card>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card
            sx={isAgentMode ? {
              border: '2px solid #00FFB2',
              '& [data-agent]': {
                outline: '1px solid rgba(0, 255, 178, 0.3)',
                outlineOffset: '2px',
              }
            } : undefined}
          >
            <CardContent>
              <Box 
                sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  gap: 2,
                }}
                data-agent="contact-section"
              >
                <Avatar
                  sx={{ 
                    width: 120, 
                    height: 120,
                    border: '3px solid #00FFB2',
                    background: 'linear-gradient(135deg, #00FFB2 0%, #00CC8E 100%)',
                  }}
                  data-agent="profile-avatar"
                >
                  YN
                </Avatar>
                <Typography variant="h6">
                  {isAgentMode ? 'DEVELOPER_NAME=Your Name' : 'Your Name'}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {isAgentMode ? 'DEVELOPER_TITLE=Full Stack Developer' : 'Full Stack Developer'}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Link 
                    href="https://github.com/yourusername" 
                    target="_blank"
                    sx={{ color: '#00FFB2' }}
                    data-agent="github-link"
                  >
                    GitHub
                  </Link>
                  <Link 
                    href="https://linkedin.com/in/yourusername" 
                    target="_blank"
                    sx={{ color: '#00FFB2' }}
                    data-agent="linkedin-link"
                  >
                    LinkedIn
                  </Link>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}; 