import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

interface QuizStartProps {
    language: string;
    level: string;
    onStart: (quizId: number) => void;
    onClose: () => void;
}

interface Quiz {
    id: number;
    title: string;
    description: string;
    level: string;
    language: {
        name: string;
        code: string;
        flag_emoji: string;
    };
}

const QuizStart: React.FC<QuizStartProps> = ({ language, level, onStart, onClose }) => {
    const { token } = useAuth();
    const [loading, setLoading] = useState(true);
    const [startingQuiz, setStartingQuiz] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [quiz, setQuiz] = useState<Quiz | null>(null);

    useEffect(() => {
        loadQuiz();
    }, [language, level, token]);

    const loadQuiz = async () => {
        try {
            setLoading(true);
            setError(null);
            console.log('Loading quiz with params:', { language, level });
            const response = await axios.get('/api/quizzes/', {
                params: { language, level },
                headers: { Authorization: `Bearer ${token}` }
            });
            console.log('Quiz API response:', response.data);

            if (response.data.length === 0) {
                console.log('No quiz found');
                setError('No quiz available for this language and level');
                return;
            }

            console.log('Setting quiz:', response.data[0]);
            setQuiz(response.data[0]);
        } catch (err) {
            console.error('Error loading quiz:', err);
            setError('Failed to load quiz. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleStartQuiz = async () => {
        if (!quiz) return;
        
        try {
            setStartingQuiz(true);
            setError(null);
            
            // Start the quiz
            await axios.post(`/api/quizzes/${quiz.id}/start/`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });

            // Navigate to the quiz
            onStart(quiz.id);
        } catch (err) {
            setError('Failed to start quiz. Please try again.');
            console.error('Error starting quiz:', err);
            setStartingQuiz(false);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" p={3}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
            <Typography variant="h6">
                Start {level.charAt(0).toUpperCase() + level.slice(1)} {language.charAt(0).toUpperCase() + language.slice(1)} Quiz
            </Typography>
            
            {error && (
                <Alert severity="error" sx={{ width: '100%' }}>
                    {error}
                </Alert>
            )}

            {/* Debug information */}
            <Box sx={{ display: 'none' }}>
                <pre>
                    {JSON.stringify({
                        loading,
                        startingQuiz,
                        hasQuiz: !!quiz,
                        error
                    }, null, 2)}
                </pre>
            </Box>

            {quiz && (
                <>
                    <Typography variant="body1" color="text.secondary" align="center">
                        {quiz.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" align="center">
                        {quiz.description}
                    </Typography>
                </>
            )}

            <Box display="flex" gap={2}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={startingQuiz}
                >
                    Cancel
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleStartQuiz}
                    disabled={loading || startingQuiz || !quiz}
                >
                    {startingQuiz ? (
                        <CircularProgress size={24} color="inherit" />
                    ) : (
                        'Start Quiz'
                    )}
                </Button>
            </Box>
        </Box>
    );
};

export default QuizStart; 