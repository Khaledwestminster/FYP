import React, { useState, useEffect } from 'react';
import '../styles/QuizQuestion.css';

const QuizQuestion = ({ question, onSubmit, showFeedback, isCorrect, userAnswer }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (question.audio_url) {
      setAudioUrl(question.audio_url);
    }
  }, [question]);

  const handleAnswerSelect = (answer) => {
    if (!showFeedback) {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (selectedAnswer) {
      onSubmit(selectedAnswer);
    }
  };

  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };

  const getAnswerClass = (answer) => {
    if (!showFeedback) return '';
    if (answer === question.correct_answer) return 'correct';
    if (answer === userAnswer && !isCorrect) return 'incorrect';
    return '';
  };

  return (
    <div className="question-container">
      <h2 className="question-text">{question.question_text}</h2>
      
      {audioUrl && (
        <button className="play-audio-button" onClick={playAudio}>
          Play Audio
        </button>
      )}

      <div className="options-container">
        {[question.option1, question.option2, question.option3].map((option, index) => (
          <button
            key={index}
            className={`option-button ${getAnswerClass(option)} ${
              selectedAnswer === option ? 'selected' : ''
            }`}
            onClick={() => handleAnswerSelect(option)}
            disabled={showFeedback}
          >
            {option}
          </button>
        ))}
      </div>

      {!showFeedback && selectedAnswer && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit Answer
        </button>
      )}

      {showFeedback && (
        <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
          {isCorrect ? 'Correct!' : 'Incorrect. Try again!'}
        </div>
      )}
    </div>
  );
};

export default QuizQuestion; 