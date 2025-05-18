import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import axios from '../../utils/axios';
import QuizPlayer from './QuizPlayer';

interface Quiz {
  id: number;
  title: string;
  description: string;
  level: string;
  language: {
    name: string;
    flag_emoji: string;
  };
}

const QuizView: React.FC = () => {
  const { languageCode, level } = useParams<{ languageCode: string; level: string }>();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadQuiz();
  }, [languageCode, level]);

  const loadQuiz = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`/api/quizzes/`, {
        params: { language: languageCode, level },
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.data.length > 0) {
        setQuiz(response.data[0]);
      } else {
        setError('No quiz found for this language and level');
      }
    } catch (error) {
      console.error('Error loading quiz:', error);
      setError('Failed to load quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartQuiz = async () => {
    if (!quiz) return;
    
    try {
      // Start the quiz
      await axios.post(`/api/quizzes/${quiz.id}/start/`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsPlaying(true);
    } catch (error) {
      console.error('Error starting quiz:', error);
      setError('Failed to start quiz. Please try again.');
    }
  };

  const handleQuizComplete = (score: number) => {
    setScore(score);
    setIsPlaying(false);
    setShowResults(true);
  };

  const handleCloseResults = () => {
    setShowResults(false);
    navigate('/dashboard');
  };

  if (loading) {
    return (
      <Container maxWidth="md" className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
        <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="md" className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
          <Button variant="contained" onClick={() => navigate('/courses')}>
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  if (!quiz) {
    return (
      <Container maxWidth="md" className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
        <Box sx={{ my: 4 }}>
          <Alert severity="warning">
            Quiz not found. Please try another course.
          </Alert>
          <Button variant="contained" onClick={() => navigate('/courses')} sx={{ mt: 2 }}>
            Back to Courses
          </Button>
        </Box>
      </Container>
    );
  }

  if (isPlaying) {
    return (
      <Box className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
        <QuizPlayer quizId={quiz.id} onComplete={handleQuizComplete} />
      </Box>
    );
  }

  return (
    <Container maxWidth="md" className="page-content" sx={{ pt: { xs: 10, sm: 12 } }}>
      <Box sx={{ my: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {quiz.language.flag_emoji} {quiz.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary" gutterBottom>
              Level: {quiz.level.charAt(0).toUpperCase() + quiz.level.slice(1)}
            </Typography>
            <Typography variant="body1" paragraph>
              {quiz.description}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              size="large"
              onClick={handleStartQuiz}
              fullWidth
            >
              Start Quiz
            </Button>
          </CardContent>
        </Card>

        <Dialog open={showResults} onClose={handleCloseResults}>
          <DialogTitle>Quiz Results</DialogTitle>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Your Score: {score.toFixed(1)}%
            </Typography>
            <Typography variant="body1">
              {score >= 70
                ? 'Great job! You\'ve mastered this level!'
                : 'Keep practicing to improve your score!'}
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseResults} color="primary">
              Return to Dashboard
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default QuizView; 