import React, { useState, useEffect, useRef } from 'react';
import { Box, Button, Card, Typography, LinearProgress, Container, Alert } from '@mui/material';
import { VolumeUp } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import axiosInstance from '../../utils/axios';
import SpeechRecognition from './SpeechRecognition';

// In development, we use localhost:8000, in production this should be configured
const BACKEND_URL = 'http://localhost:8000';

interface Question {
  id: number;
  text: string;
  question_type: 'multiple_choice' | 'speech' | 'translation';
  options: Array<{
    id: number;
    text: string;
  }>;
  audio_url?: string;
  quiz: {
    language: {
      code: string;
    };
  };
}

interface QuizPlayerProps {
  quizId: number;
  onComplete: (score: number) => void;
}

const QuizPlayer: React.FC<QuizPlayerProps> = ({ quizId, onComplete }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [spokenAnswer, setSpokenAnswer] = useState<string>('');
  const [answers, setAnswers] = useState<Array<{ question_id: number; selected_option_id: number }>>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [audioPlaying, setAudioPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { token } = useAuth();

  useEffect(() => {
    loadQuizQuestions();
  }, [quizId]);

  const loadQuizQuestions = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axiosInstance.get(`/api/quizzes/${quizId}/`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (!response.data.questions || response.data.questions.length === 0) {
        setError('No questions available for this quiz.');
        return;
      }
      
      setQuestions(response.data.questions);
    } catch (error) {
      console.error('Error loading quiz questions:', error);
      setError('Failed to load quiz questions. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePlayAudio = () => {
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion?.audio_url && audioRef.current) {
      if (audioPlaying) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      } else {
        audioRef.current.play();
      }
      setAudioPlaying(!audioPlaying);
    }
  };

  const handleSpeechResult = (transcript: string) => {
    setSpokenAnswer(transcript);
    // For speech questions, we'll find the closest matching option
    const currentQuestion = questions[currentQuestionIndex];
    if (currentQuestion.question_type === 'speech') {
      const options = currentQuestion.options;
      const bestMatch = options.reduce((prev, curr) => {
        const prevSimilarity = calculateStringSimilarity(transcript.toLowerCase(), prev.text.toLowerCase());
        const currSimilarity = calculateStringSimilarity(transcript.toLowerCase(), curr.text.toLowerCase());
        return currSimilarity > prevSimilarity ? curr : prev;
      });
      setSelectedOption(bestMatch.id);
    }
  };

  const calculateStringSimilarity = (str1: string, str2: string): number => {
    const len1 = str1.length;
    const len2 = str2.length;
    const matrix = Array(len1 + 1).fill(null).map(() => Array(len2 + 1).fill(0));

    for (let i = 0; i <= len1; i++) matrix[i][0] = i;
    for (let j = 0; j <= len2; j++) matrix[0][j] = j;

    for (let i = 1; i <= len1; i++) {
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j - 1] + cost
        );
      }
    }

    const maxLen = Math.max(len1, len2);
    return (maxLen - matrix[len1][len2]) / maxLen;
  };

  const handleOptionSelect = (optionId: number) => {
    setSelectedOption(optionId);
  };

  const handleNextQuestion = async () => {
    if (selectedOption === null) return;

    const currentQuestion = questions[currentQuestionIndex];
    setAnswers([...answers, {
      question_id: currentQuestion.id,
      selected_option_id: selectedOption
    }]);

    if (currentQuestionIndex === questions.length - 1) {
      // Submit quiz
      try {
        const response = await axiosInstance.post(`/api/quizzes/${quizId}/submit/`, answers, {
          headers: { Authorization: `Bearer ${token}` }
        });
        onComplete(response.data.score_percentage);
      } catch (error) {
        console.error('Error submitting quiz:', error);
      }
    } else {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setSpokenAnswer('');
      setAudioPlaying(false);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <LinearProgress />
          <Typography variant="body1" align="center" sx={{ mt: 2 }}>
            Loading quiz questions...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !questions.length) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Alert severity="error" sx={{ mb: 2 }}>
            {error || 'No questions available for this quiz.'}
          </Alert>
          <Button variant="contained" onClick={() => window.history.back()}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    return (
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box sx={{ my: 4 }}>
          <Alert severity="error">
            Question not found. Please try again.
          </Alert>
          <Button variant="contained" onClick={() => window.history.back()} sx={{ mt: 2 }}>
            Go Back
          </Button>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ mt: 4 }}>
      <Box sx={{ my: 4 }}>
        <LinearProgress 
          variant="determinate" 
          value={(currentQuestionIndex / questions.length) * 100} 
          sx={{ mb: 3, height: 8, borderRadius: 4 }}
        />
        
        <Card sx={{ p: { xs: 2, sm: 3 }, boxShadow: 3 }}>
          <Typography variant="h6" gutterBottom fontWeight="bold">
            Question {currentQuestionIndex + 1} of {questions.length}
          </Typography>
          
          <Typography variant="body1" sx={{ mb: 3, fontSize: '1.1rem' }}>
            {currentQuestion.text}
          </Typography>

          {currentQuestion.audio_url && (
            <Box sx={{ mb: 3 }}>
              <audio
                ref={audioRef}
                src={currentQuestion.audio_url.startsWith('http') ? currentQuestion.audio_url : `${axiosInstance.defaults.baseURL}${currentQuestion.audio_url}`}
                onEnded={() => setAudioPlaying(false)}
              />
              <Button
                startIcon={<VolumeUp />}
                variant="outlined"
                onClick={handlePlayAudio}
                sx={{ mr: 1, py: 1, px: 2 }}
              >
                {audioPlaying ? 'Stop Audio' : 'Play Audio'}
              </Button>
            </Box>
          )}

          {currentQuestion.question_type === 'speech' ? (
            <SpeechRecognition
              languageCode={currentQuestion.quiz.language.code}
              onResult={handleSpeechResult}
            />
          ) : (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              {currentQuestion.options?.map((option) => (
                <Button
                  key={option.id}
                  variant={selectedOption === option.id ? "contained" : "outlined"}
                  onClick={() => handleOptionSelect(option.id)}
                  fullWidth
                  sx={{ 
                    py: 1.5, 
                    justifyContent: 'flex-start', 
                    textAlign: 'left',
                    fontWeight: selectedOption === option.id ? 'bold' : 'normal'
                  }}
                >
                  {option.text}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
            <Button
              variant="contained"
              color="primary"
              size="large"
              disabled={selectedOption === null}
              onClick={handleNextQuestion}
              sx={{ px: 4, py: 1 }}
            >
              {currentQuestionIndex === questions.length - 1 ? 'Submit' : 'Next'}
            </Button>
          </Box>
        </Card>
      </Box>
    </Container>
  );
};

export default QuizPlayer; 