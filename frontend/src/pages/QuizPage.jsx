import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseDetails } from '../utils/api';
import '../styles/QuizPage.css';

const QuizPage = () => {
  const { language, level } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [quiz, setQuiz] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  useEffect(() => {
    loadQuiz();
  }, [language, level]);

  const loadQuiz = async () => {
    try {
      const data = await getCourseDetails(language, level);
      setQuiz(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleAnswer = (selectedAnswer) => {
    if (!quiz || currentQuestion >= quiz.questions.length) return;

    const question = quiz.questions[currentQuestion];
    if (selectedAnswer === question.correctAnswer) {
      setScore(score + 1);
    }

    if (currentQuestion + 1 < quiz.questions.length) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      setShowResult(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setShowResult(false);
  };

  if (loading) {
    return <div className="loading">Loading quiz...</div>;
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error</h2>
        <p>{error}</p>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="quiz-result">
        <h2>Quiz Complete!</h2>
        <p>Your score: {score} out of {quiz.questions.length}</p>
        <div className="result-buttons">
          <button onClick={restartQuiz}>Try Again</button>
          <button onClick={() => navigate('/courses')}>Back to Courses</button>
        </div>
      </div>
    );
  }

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="no-questions">
        <h2>No questions available</h2>
        <button onClick={() => navigate('/courses')}>Back to Courses</button>
      </div>
    );
  }

  const question = quiz.questions[currentQuestion];

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <h2>{language.charAt(0).toUpperCase() + language.slice(1)} - {level.charAt(0).toUpperCase() + level.slice(1)}</h2>
        <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>
      </div>

      <div className="question-container">
        <h3>{question.text}</h3>
        <div className="options-container">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => handleAnswer(option)}
              className="option-button"
            >
              {option}
            </button>
          ))}
        </div>
      </div>

      <div className="quiz-progress">
        <div 
          className="progress-bar"
          style={{ width: `${((currentQuestion + 1) / quiz.questions.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
};

export default QuizPage; 