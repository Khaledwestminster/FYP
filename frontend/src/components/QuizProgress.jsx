import React from 'react';
import '../styles/QuizProgress.css';

const QuizProgress = ({ progress }) => {
  return (
    <div className="progress-container">
      <div className="progress-bar">
        <div 
          className="progress-fill"
          style={{ width: `${progress}%` }}
        />
      </div>
      <span className="progress-text">{Math.round(progress)}%</span>
    </div>
  );
};

export default QuizProgress; 