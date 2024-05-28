import React, { useState, useEffect } from 'react';
import axios from 'axios';

const generateQuestion = (level) => {
  const max = level === 1 ? 5 : 9;
  const num1 = Math.floor(Math.random() * (max + 1));
  const num2 = Math.floor(Math.random() * (max + 1));
  return { num1, num2, answer: num1 + num2 };
};

const Maths = ({ user }) => {
  const [level, setLevel] = useState(user.level);
  const [question, setQuestion] = useState(generateQuestion(level));
  const [answer, setAnswer] = useState('');
  const [score, setScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [showScore, setShowScore] = useState(false);

  const handleSubmit = () => {
    if (parseInt(answer) === question.answer) {
      setScore(score + 1);
    }
    setSubmitted(true);
  };

  const handleNext = () => {
    if (questionIndex < 9) {
      setQuestion(generateQuestion(level));
      setAnswer('');
      setSubmitted(false);
      setQuestionIndex(questionIndex + 1);
    } else {
      setShowScore(true);
      axios.post('http://localhost:5000/score', { username: user.username, score }).then((res) => {
        setLevel(res.data.level);
      });
    }
  };

  const handleProceed = () => {
    setScore(0);
    setQuestionIndex(0);
    setQuestion(generateQuestion(level));
    setAnswer('');
    setSubmitted(false);
    setShowScore(false);
  };

  useEffect(() => {
    if (!showScore) {
      document.getElementById('answerInput').focus();
    }
  }, [submitted, questionIndex, showScore]);

  if (showScore) {
    return (
      <div>
        <h2>Maths - Level {level}</h2>
        <p>Your score: {score}/10</p>
        <p>Do you want to continue?</p>
        <button onClick={handleProceed}>Proceed</button>
      </div>
    );
  }

  return (
    <div>
      <h2>Maths - Level {level}</h2>
      <p>{question.num1} + {question.num2} = ?</p>
      <input
        id="answerInput"
        type="number"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        disabled={submitted}
      />
      <button onClick={handleSubmit} disabled={submitted}>Submit</button>
      <button onClick={handleNext} disabled={!submitted}>Next</button>
    </div>
  );
};

export default Maths;
