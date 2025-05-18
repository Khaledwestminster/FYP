import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import {
    Box,
    Typography,
    Button,
    Card,
    CardContent,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
    CircularProgress,
    Alert,
    LinearProgress,
    IconButton,
    Tooltip,
    Dialog
} from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { useAuth } from '../contexts/AuthContext';
import TTSPlayer from './TTSPlayer';
import QuizReview from './QuizReview';

interface Question {
    id: number;
    question_text: string;
    question_type: 'mcq' | 'tts';
    audio_url?: string;
    options?: string[];
    order: number;
    hint?: string;
}

interface Quiz {
    id: number;
    title: string;
    language: string;
    level: string;
    description: string;
    questions: Question[];
}

interface UserProgress {
    id: number;
    quiz: Quiz;
    current_question: Question;
    completed: boolean;
    score: number;
    started_at: string;
    completed_at?: string;
}

interface QuizAnswer {
    question_id: number;
    question_text: string;
    question_type: 'mcq' | 'tts';
    audio_url?: string;
    options?: string[];
    correct_answer: string;
    user_answer: string;
}

const Quiz: React.FC = () => {
    const { quizId } = useParams<{ quizId: string }>();
    const navigate = useNavigate();
    const { token } = useAuth();
    const [quiz, setQuiz] = useState<Quiz | null>(null);
    const [currentQuestion, setCurrentQuestion] = useState<Question | null>(null);
    const [selectedAnswer, setSelectedAnswer] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [completed, setCompleted] = useState<boolean>(false);
    const [progress, setProgress] = useState<number>(0);
    const [score, setScore] = useState<number>(0);
    const [totalQuestions, setTotalQuestions] = useState<number>(0);
    const [showHint, setShowHint] = useState<boolean>(false);
    const [userAnswers, setUserAnswers] = useState<QuizAnswer[]>([]);
    const [showReview, setShowReview] = useState<boolean>(false);

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await axios.get<Quiz>(`/api/quizzes/${quizId}/`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setQuiz(response.data);
                setCurrentQuestion(response.data.questions[0]);
                setTotalQuestions(response.data.questions.length);
                setLoading(false);
            } catch (err) {
                setError('Failed to load quiz');
                setLoading(false);
            }
        };

        fetchQuiz();
    }, [quizId, token]);

    const handleAnswerSubmit = async () => {
        if (!currentQuestion) return;

        try {
            const response = await axios.post<UserProgress>(
                `/api/quizzes/${quizId}/submit_answer/`,
                {
                    question_id: currentQuestion.id,
                    answer: selectedAnswer
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Add answer to userAnswers array
            setUserAnswers(prev => [...prev, {
                question_id: currentQuestion.id,
                question_text: currentQuestion.question_text,
                question_type: currentQuestion.question_type,
                audio_url: currentQuestion.audio_url,
                options: currentQuestion.options,
                correct_answer: response.data.current_question.correct_answer,
                user_answer: selectedAnswer
            }]);

            if (response.data.completed) {
                setCompleted(true);
                setScore(response.data.score);
                setShowReview(true);
            } else {
                const nextQuestionIndex = quiz?.questions.findIndex(
                    q => q.id === response.data.current_question.id
                ) ?? 0;
                setCurrentQuestion(response.data.current_question);
                setSelectedAnswer('');
                setProgress(((nextQuestionIndex + 1) / totalQuestions) * 100);
                setShowHint(false);
            }
        } catch (err) {
            setError('Failed to submit answer');
        }
    };

    const handleTTSConfidence = async () => {
        if (!currentQuestion) return;

        try {
            const response = await axios.post<UserProgress>(
                `/api/quizzes/${quizId}/submit_answer/`,
                {
                    question_id: currentQuestion.id,
                    answer: 'confident'
                },
                {
                    headers: { Authorization: `Bearer ${token}` }
                }
            );

            // Add answer to userAnswers array
            setUserAnswers(prev => [...prev, {
                question_id: currentQuestion.id,
                question_text: currentQuestion.question_text,
                question_type: currentQuestion.question_type,
                audio_url: currentQuestion.audio_url,
                options: currentQuestion.options,
                correct_answer: response.data.current_question.correct_answer,
                user_answer: 'confident'
            }]);

            if (response.data.completed) {
                setCompleted(true);
                setScore(response.data.score);
                setShowReview(true);
            } else {
                const nextQuestionIndex = quiz?.questions.findIndex(
                    q => q.id === response.data.current_question.id
                ) ?? 0;
                setCurrentQuestion(response.data.current_question);
                setProgress(((nextQuestionIndex + 1) / totalQuestions) * 100);
                setShowHint(false);
            }
        } catch (err) {
            setError('Failed to submit answer');
        }
    };

    const handleCloseReview = () => {
        setShowReview(false);
        navigate('/courses');
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <Alert severity="error">{error}</Alert>
            </Box>
        );
    }

    if (showReview) {
        return (
            <QuizReview
                questions={userAnswers}
                score={score}
                totalQuestions={totalQuestions}
                onClose={handleCloseReview}
            />
        );
    }

    return (
        <Box p={3}>
            <Box mb={3}>
                <LinearProgress variant="determinate" value={progress} />
                <Typography variant="body2" color="text.secondary" mt={1}>
                    Question {quiz?.questions.findIndex(q => q.id === currentQuestion?.id)! + 1} of {totalQuestions}
                </Typography>
            </Box>

            <Card>
                <CardContent>
                    <Typography variant="h5" gutterBottom>
                        {quiz?.title}
                    </Typography>
                    
                    {currentQuestion && (
                        <>
                            <Box display="flex" alignItems="center" gap={1}>
                                <Typography variant="h6" gutterBottom>
                                    {currentQuestion.question_text}
                                </Typography>
                                {currentQuestion.hint && (
                                    <Tooltip title="Show Hint">
                                        <IconButton
                                            size="small"
                                            onClick={() => setShowHint(!showHint)}
                                        >
                                            <HelpOutlineIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                            </Box>

                            {showHint && currentQuestion.hint && (
                                <Alert severity="info" sx={{ mb: 2 }}>
                                    {currentQuestion.hint}
                                </Alert>
                            )}

                            {currentQuestion.question_type === 'mcq' ? (
                                <FormControl component="fieldset">
                                    <FormLabel component="legend">Select your answer:</FormLabel>
                                    <RadioGroup
                                        value={selectedAnswer}
                                        onChange={(e) => setSelectedAnswer(e.target.value)}
                                    >
                                        {currentQuestion.options?.map((option, index) => (
                                            <FormControlLabel
                                                key={index}
                                                value={option}
                                                control={<Radio />}
                                                label={option}
                                            />
                                        ))}
                                    </RadioGroup>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleAnswerSubmit}
                                        disabled={!selectedAnswer}
                                        sx={{ mt: 2 }}
                                    >
                                        Submit Answer
                                    </Button>
                                </FormControl>
                            ) : (
                                <Box>
                                    {currentQuestion.audio_url && (
                                        <TTSPlayer
                                            audioUrl={currentQuestion.audio_url}
                                            text={currentQuestion.question_text}
                                        />
                                    )}
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        onClick={handleTTSConfidence}
                                        sx={{ mt: 2 }}
                                    >
                                        I'm Confident
                                    </Button>
                                </Box>
                            )}
                        </>
                    )}
                </CardContent>
            </Card>
        </Box>
    );
};

export default Quiz; 