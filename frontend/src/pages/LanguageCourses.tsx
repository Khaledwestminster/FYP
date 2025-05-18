import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Grid, Card, CardContent, CardActions, Button, Dialog, CircularProgress, Alert } from '@mui/material';
import QuizStart from '../components/QuizStart';
import { useAuth } from '../contexts/AuthContext';
import axios from '../utils/axios';

interface Course {
    id: number;
    title: string;
    language: string;
    level: string;
    description: string;
}

const LanguageCourses: React.FC = () => {
    const navigate = useNavigate();
    const { token } = useAuth();
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [showQuizDialog, setShowQuizDialog] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const courses: Course[] = [
        // Spanish Courses
        {
            id: 1,
            title: 'Spanish for Beginners',
            language: 'es',
            level: 'beginner',
            description: 'Learn basic Spanish vocabulary and phrases.'
        },
        {
            id: 2,
            title: 'Spanish Intermediate',
            language: 'es',
            level: 'intermediate',
            description: 'Improve your Spanish speaking and listening skills.'
        },
        {
            id: 3,
            title: 'Spanish Expert',
            language: 'es',
            level: 'expert',
            description: 'Master advanced Spanish grammar and conversation.'
        },
        // French Courses
        {
            id: 4,
            title: 'French for Beginners',
            language: 'fr',
            level: 'beginner',
            description: 'Learn basic French vocabulary and phrases.'
        },
        {
            id: 5,
            title: 'French Intermediate',
            language: 'fr',
            level: 'intermediate',
            description: 'Improve your French speaking and listening skills.'
        },
        {
            id: 6,
            title: 'French Expert',
            language: 'fr',
            level: 'expert',
            description: 'Master advanced French grammar and conversation.'
        },
        // German Courses
        {
            id: 7,
            title: 'German for Beginners',
            language: 'de',
            level: 'beginner',
            description: 'Learn basic German vocabulary and phrases.'
        },
        {
            id: 8,
            title: 'German Intermediate',
            language: 'de',
            level: 'intermediate',
            description: 'Improve your German speaking and listening skills.'
        },
        {
            id: 9,
            title: 'German Expert',
            language: 'de',
            level: 'expert',
            description: 'Master advanced German grammar and conversation.'
        },
        // Italian Courses
        {
            id: 10,
            title: 'Italian for Beginners',
            language: 'it',
            level: 'beginner',
            description: 'Learn basic Italian vocabulary and phrases.'
        },
        {
            id: 11,
            title: 'Italian Intermediate',
            language: 'it',
            level: 'intermediate',
            description: 'Improve your Italian speaking and listening skills.'
        },
        {
            id: 12,
            title: 'Italian Expert',
            language: 'it',
            level: 'expert',
            description: 'Master advanced Italian grammar and conversation.'
        }
    ];

    const handleStartCourse = (course: Course) => {
        setSelectedCourse(course);
        setShowQuizDialog(true);
    };

    const handleCloseDialog = () => {
        setShowQuizDialog(false);
        setSelectedCourse(null);
        setError(null);
    };

    const handleQuizStart = (quizId: number) => {
        if (selectedCourse) {
            navigate(`/quiz/${selectedCourse.language}/${selectedCourse.level}`);
            setShowQuizDialog(false);
        }
    };

    return (
        <Box 
            className="page-content" 
            sx={{ 
                pt: { xs: 10, sm: 12 },
                px: { xs: 2, sm: 3 },
                pb: 4
            }}
        >
            <Typography variant="h4" gutterBottom sx={{ mb: 3 }}>
                Language Courses
            </Typography>

            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <Grid container spacing={3}>
                {courses.map((course) => (
                    <Grid item xs={12} sm={6} md={4} key={course.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="h6" gutterBottom>
                                    {course.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {course.description}
                                </Typography>
                            </CardContent>
                            <CardActions>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => handleStartCourse(course)}
                                    fullWidth
                                >
                                    Start Course
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            <Dialog
                open={showQuizDialog}
                onClose={handleCloseDialog}
                maxWidth="sm"
                fullWidth
            >
                <Box p={3}>
                    {selectedCourse && (
                        <QuizStart
                            language={selectedCourse.language}
                            level={selectedCourse.level}
                            onStart={handleQuizStart}
                            onClose={handleCloseDialog}
                        />
                    )}
                </Box>
            </Dialog>
        </Box>
    );
};

export default LanguageCourses; 