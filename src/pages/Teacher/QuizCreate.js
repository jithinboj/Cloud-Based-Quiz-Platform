import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createQuiz } from '../../services/api';
import './QuizCreate.css';

const QuizCreate = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [questions, setQuestions] = useState([{ text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleQuestionChange = (index, event) => {
    const newQuestions = [...questions];
    newQuestions[index].text = event.target.value;
    setQuestions(newQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].options[oIndex] = event.target.value;
    setQuestions(newQuestions);
  };
  
  const handleCorrectAnswerChange = (qIndex, event) => {
    const newQuestions = [...questions];
    newQuestions[qIndex].correctAnswer = parseInt(event.target.value, 10);
    setQuestions(newQuestions);
  };

  const addQuestion = () => {
    setQuestions([...questions, { text: '', options: ['', '', '', ''], correctAnswer: 0 }]);
  };

  const removeQuestion = (index) => {
    const newQuestions = questions.filter((_, qIndex) => qIndex !== index);
    setQuestions(newQuestions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const quizData = { title, description, questions };
      await createQuiz(quizData);
      navigate('/teacher/quizzes'); // Redirect to quiz list on success
    } catch (err) {
      setError('Failed to create quiz. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="quiz-create-container">
      <form onSubmit={handleSubmit} className="quiz-form">
        <h2>Create a New Quiz</h2>
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="title">Quiz Title</label>
          <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
        </div>
        
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>

        <h3>Questions</h3>
        {questions.map((q, qIndex) => (
          <div key={qIndex} className="question-block">
            <h4>Question {qIndex + 1}</h4>
            <textarea
              placeholder="Enter question text..."
              value={q.text}
              onChange={(e) => handleQuestionChange(qIndex, e)}
              required
            />
            <div className="options-container">
              {q.options.map((opt, oIndex) => (
                <div key={oIndex} className="option-input">
                  <input
                    type="text"
                    placeholder={`Option ${oIndex + 1}`}
                    value={opt}
                    onChange={(e) => handleOptionChange(qIndex, oIndex, e)}
                    required
                  />
                  <input
                    type="radio"
                    name={`correctAnswer-${qIndex}`}
                    value={oIndex}
                    checked={q.correctAnswer === oIndex}
                    onChange={(e) => handleCorrectAnswerChange(qIndex, e)}
                  />
                  <label>Correct</label>
                </div>
              ))}
            </div>
            <button type="button" onClick={() => removeQuestion(qIndex)} className="remove-btn">
              Remove Question
            </button>
          </div>
        ))}

        <div className="form-actions">
          <button type="button" onClick={addQuestion} className="add-btn">Add Question</button>
          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? 'Saving...' : 'Create Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default QuizCreate;
