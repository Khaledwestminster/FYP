import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const features = [
    {
      title: 'Multiple Languages',
      description: 'Learn Spanish, French, German, and Italian with native speakers',
      image: '/images/languages.jpg',
    },
    {
      title: 'Interactive Learning',
      description: 'Practice with speech recognition and real-time feedback',
      image: '/images/interactive.jpg',
    },
    {
      title: 'Track Progress',
      description: 'Monitor your learning journey with detailed statistics',
      image: '/images/progress.jpg',
    },
  ];

  return (
    <Box className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 8 },
          mb: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Grid container justifyContent="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h2" 
                component="h1" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold',
                  fontSize: { xs: '2.5rem', md: '3.5rem' }
                }}
              >
                Master New Languages
              </Typography>
              <Typography 
                variant="h5" 
                paragraph 
                sx={{ 
                  fontWeight: 600,
                  mb: 3,
                  fontSize: { xs: '1.2rem', md: '1.5rem' }
                }}
              >
                Learn languages effectively with our interactive platform
              </Typography>
              <Button
                variant="contained"
                color="secondary"
                size="large"
                onClick={() => navigate(isAuthenticated ? '/dashboard' : '/register')}
                sx={{ 
                  mt: 2,
                  py: 1.5,
                  px: 4,
                  fontWeight: 'bold',
                  fontSize: '1.1rem'
                }}
              >
                {isAuthenticated ? 'Go to Dashboard' : 'Get Started'}
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ mb: 6 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ fontWeight: 'bold', mb: 4 }}
        >
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ height: '100%' }}>
                <CardMedia
                  component="img"
                  height="140"
                  image={feature.image}
                  alt={feature.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography variant="h5" component="h3" gutterBottom sx={{ fontWeight: 'bold' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{ bgcolor: 'grey.100', py: 6, textAlign: 'center' }}>
        <Container maxWidth="sm">
          <Typography 
            variant="h4" 
            component="h3" 
            align="center" 
            gutterBottom
            sx={{ fontWeight: 'bold' }}
          >
            Ready to Start Learning?
          </Typography>
          <Typography variant="body1" align="center" paragraph>
            Join thousands of learners already using our platform to master new languages.
          </Typography>
          <Box sx={{ textAlign: 'center', mt: 3 }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={() => navigate(isAuthenticated ? '/courses' : '/register')}
              sx={{ 
                py: 1.5, 
                px: 4,
                fontWeight: 'bold'
              }}
            >
              {isAuthenticated ? 'Browse Courses' : 'Sign Up Now'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default Home; 