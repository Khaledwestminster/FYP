import React from 'react';
import {
    Box,
    Typography,
    Card,
    CardContent,
    List,
    ListItem,
    ListItemText,
    Chip,
    Button,
    Divider,
    Paper
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import TTSPlayer from './TTSPlayer';

interface Question {
    id: number;
    question_text: string;
    question_type: 'mcq' | 'tts';
    audio_url?: string;
    options?: string[];
    correct_answer: string;
    user_answer: string;
}

interface QuizReviewProps {
    questions: Question[];
    score: number;
    totalQuestions: number;
    onClose: () => void;
}

const QuizReview: React.FC<QuizReviewProps> = ({
    questions,
    score,
    totalQuestions,
    onClose
}) => {
    const scorePercentage = (score / totalQuestions) * 100;
    const getScoreColor = (percentage: number) => {
        if (percentage >= 80) return 'success';
        if (percentage >= 60) return 'warning';
        return 'error';
    };

    return (
        <Box p={3}>
            <Paper elevation={3} sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Quiz Results
                </Typography>
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Typography variant="h5">
                        Score: {score}/{totalQuestions}
                    </Typography>
                    <Chip
                        label={`${scorePercentage.toFixed(1)}%`}
                        color={getScoreColor(scorePercentage)}
                        size="large"
                    />
                </Box>
                <Typography variant="body1" color="text.secondary">
                    Review your answers below. Correct answers are marked in green, incorrect in red.
                </Typography>
            </Paper>

            <List>
                {questions.map((question, index) => {
                    const isCorrect = question.user_answer === question.correct_answer;
                    return (
                        <Card key={question.id} sx={{ mb: 2 }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={2}>
                                    <Typography variant="h6">
                                        Question {index + 1}
                                    </Typography>
                                    {isCorrect ? (
                                        <CheckCircleIcon color="success" />
                                    ) : (
                                        <CancelIcon color="error" />
                                    )}
                                </Box>

                                <Typography variant="body1" gutterBottom>
                                    {question.question_text}
                                </Typography>

                                {question.audio_url && (
                                    <Box mb={2}>
                                        <TTSPlayer
                                            audioUrl={question.audio_url}
                                            text={question.question_text}
                                        />
                                    </Box>
                                )}

                                {question.question_type === 'mcq' && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle1" gutterBottom>
                                            Your answer: {question.user_answer}
                                        </Typography>
                                        {!isCorrect && (
                                            <Typography variant="subtitle1" color="success.main">
                                                Correct answer: {question.correct_answer}
                                            </Typography>
                                        )}
                                    </Box>
                                )}

                                {question.question_type === 'tts' && (
                                    <Box mt={2}>
                                        <Typography variant="subtitle1">
                                            {isCorrect
                                                ? 'You correctly identified the pronunciation'
                                                : 'You need more practice with this pronunciation'}
                                        </Typography>
                                    </Box>
                                )}
                            </CardContent>
                        </Card>
                    );
                })}
            </List>

            <Box display="flex" justifyContent="center" mt={3}>
                <Button
                    variant="contained"
                    color="primary"
                    size="large"
                    onClick={onClose}
                >
                    Return to Courses
                </Button>
            </Box>
        </Box>
    );
};

export default QuizReview; 