import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardActions,
  Button,
  CircularProgress,
  LinearProgress,
  Avatar,
} from '@mui/material';
import {
  School as SchoolIcon,
  Timeline as TimelineIcon,
  EmojiEvents as EmojiEventsIcon,
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

interface Language {
  id: number;
  name: string;
  code: string;
  flag_emoji: string;
}

interface Quiz {
  id: number;
  title: string;
  level: string;
  language: Language;
}

interface UserProgress {
  id: number;
  quiz: Quiz;
  score: number;
  completed: boolean;
  last_attempted: string;
}

const Dashboard: React.FC = () => {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [progress, setProgress] = useState<UserProgress[]>([]);
  const [languages, setLanguages] = useState<Language[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [progressRes, languagesRes] = await Promise.all([
          axios.get('/api/quizzes/progress/', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('/api/quizzes/languages/', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        setProgress(progressRes.data);
        setLanguages(languagesRes.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  const calculateOverallProgress = () => {
    if (progress.length === 0) return 0;
    const completedQuizzes = progress.filter(p => p.completed).length;
    return (completedQuizzes / progress.length) * 100;
  };

  const getLanguageProgress = (languageId: number) => {
    const languageQuizzes = progress.filter(p => p.quiz.language.id === languageId);
    if (languageQuizzes.length === 0) return 0;
    
    const totalScore = languageQuizzes.reduce((sum, p) => sum + p.score, 0);
    return totalScore / languageQuizzes.length;
  };

  const getRecentActivity = () => {
    return [...progress]
      .sort((a, b) => new Date(b.last_attempted).getTime() - new Date(a.last_attempted).getTime())
      .slice(0, 3);
  };

  if (loading) {
    return (
      <Box 
        className="page-content"
        sx={{ 
          pt: { xs: 10, sm: 12 },
          display: "flex", 
          justifyContent: "center", 
          alignItems: "center", 
          minHeight: "80vh" 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box 
      className="page-content" 
      sx={{ 
        pt: { xs: 10, sm: 12 },
        px: { xs: 2, sm: 3 },
        pb: 4
      }}
    >
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" gutterBottom fontWeight="bold">
            Welcome back, {user?.fullName}! 👋
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Continue your language learning journey
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Overall Progress Section */}
          <Grid item xs={12} md={4}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <TimelineIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">Overall Progress</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', my: 2 }}>
                  <Box sx={{ position: 'relative', display: 'inline-flex' }}>
                    <CircularProgress
                      variant="determinate"
                      value={calculateOverallProgress()}
                      size={100}
                      thickness={4}
                      sx={{ color: theme => theme.palette.primary.main }}
                    />
                    <Box
                      sx={{
                        top: 0,
                        left: 0,
                        bottom: 0,
                        right: 0,
                        position: 'absolute',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Typography variant="h6" component="div" fontWeight="bold">
                        {`${Math.round(calculateOverallProgress())}%`}
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>

          {/* Language Progress Section */}
          <Grid item xs={12} md={8}>
            <Card elevation={2} sx={{ height: '100%' }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <SchoolIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">Your Languages</Typography>
                </Box>
                <Grid container spacing={3}>
                  {languages.map((language) => (
                    <Grid item xs={12} sm={6} key={language.id}>
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                          <Typography variant="subtitle1" fontWeight="medium">
                            {language.flag_emoji} {language.name}
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={getLanguageProgress(language.id)}
                          sx={{ height: 10, borderRadius: 5 }}
                        />
                        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                          {Math.round(getLanguageProgress(language.id))}% Complete
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              </CardContent>
              <CardActions sx={{ px: 2, pb: 2 }}>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/courses')}
                  sx={{ fontWeight: 'medium' }}
                >
                  Start New Course
                </Button>
              </CardActions>
            </Card>
          </Grid>

          {/* Recent Activity Section */}
          <Grid item xs={12}>
            <Card elevation={2}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <EmojiEventsIcon color="primary" sx={{ mr: 1.5, fontSize: 28 }} />
                  <Typography variant="h6" fontWeight="bold">Recent Activity</Typography>
                </Box>
                <Grid container spacing={3}>
                  {getRecentActivity().length > 0 ? (
                    getRecentActivity().map((activity) => (
                      <Grid item xs={12} sm={6} md={4} key={activity.id}>
                        <Card variant="outlined" sx={{ height: '100%' }}>
                          <CardContent>
                            <Typography variant="subtitle1" gutterBottom fontWeight="medium">
                              {activity.quiz.language.flag_emoji} {activity.quiz.title}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Level: {activity.quiz.level}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Score: {activity.score}%
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 1 }}>
                              {new Date(activity.last_attempted).toLocaleDateString()}
                            </Typography>
                          </CardContent>
                        </Card>
                      </Grid>
                    ))
                  ) : (
                    <Grid item xs={12}>
                      <Typography variant="body1" color="text.secondary" align="center">
                        No recent activity. Start a course to see your progress!
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Dashboard; 