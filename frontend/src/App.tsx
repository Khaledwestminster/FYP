import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import theme from './theme';
import Layout from './components/Layout';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import LanguageCourses from './pages/LanguageCourses.tsx';
import Dashboard from './pages/Dashboard';
import QuizView from './components/quiz/QuizView';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './contexts/AuthContext';

const App: React.FC = () => {
    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
                <Router>
                    <Layout>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/dashboard" element={
                                <PrivateRoute>
                                    <Dashboard />
                                </PrivateRoute>
                            } />
                            <Route path="/courses" element={
                                <PrivateRoute>
                                    <LanguageCourses />
                                </PrivateRoute>
                            } />
                            <Route path="/quiz/:languageCode/:level" element={
                                <PrivateRoute>
                                    <QuizView />
                                </PrivateRoute>
                            } />
                        </Routes>
                    </Layout>
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
};

export default App; 