import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getAvailableQuizzes } from '../../services/api';
import './QuizList.css'; // New CSS file for this component

const QuizList = () => {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        const response = await getAvailableQuizzes();
        setQuizzes(response.data);
      } catch (err) {
        setError('Could not fetch quizzes. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchQuizzes();
  }, []);

  if (loading) return <div>Loading available quizzes...</div>;
  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="student-quiz-list-container">
      <h2>Available Quizzes</h2>
      {quizzes.length === 0 ? (
        <p>No quizzes are available at the moment. Check back later!</p>
      ) : (
        <div className="quiz-grid-student">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="quiz-card-student">
              <h3>{quiz.title}</h3>
              <p>{quiz.description}</p>
              <span>{quiz.questions.length} Questions</span>
              <Link to={`/student/quiz/attempt/${quiz._id}`} className="start-quiz-btn">
                Start Quiz
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default QuizList;
