import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizById, submitQuiz } from '../../services/api';
import './QuizAttempt.css';

const QuizAttempt = () => {
    const { quizId } = useParams();
    const navigate = useNavigate();

    const [quiz, setQuiz] = useState(null);
    const [answers, setAnswers] = useState({});
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuiz = async () => {
            try {
                const response = await getQuizById(quizId);
                setQuiz(response.data);
                // Initialize answers state
                const initialAnswers = {};
                response.data.questions.forEach(q => {
                    initialAnswers[q._id] = null;
                });
                setAnswers(initialAnswers);
            } catch (err) {
                setError('Failed to load the quiz.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuiz();
    }, [quizId]);

    const handleAnswerChange = (questionId, optionIndex) => {
        setAnswers({
            ...answers,
            [questionId]: optionIndex,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await submitQuiz(quizId, answers);
            // Redirect to results page after successful submission
            navigate('/student/results');
        } catch (err) {
            setError('There was an error submitting your quiz.');
            setSubmitting(false);
        }
    };

    if (loading) return <div>Loading Quiz...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="quiz-attempt-container">
            <h2>{quiz.title}</h2>
            <p>{quiz.description}</p>
            <form onSubmit={handleSubmit}>
                {quiz.questions.map((q, index) => (
                    <div key={q._id} className="question-container">
                        <h3>{index + 1}. {q.text}</h3>
                        <div className="options">
                            {q.options.map((option, oIndex) => (
                                <label key={oIndex} className="option-label">
                                    <input
                                        type="radio"
                                        name={q._id}
                                        value={oIndex}
                                        onChange={() => handleAnswerChange(q._id, oIndex)}
                                        checked={answers[q._id] === oIndex}
                                    />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>
                ))}
                <button type="submit" className="submit-quiz-btn" disabled={submitting}>
                    {submitting ? 'Submitting...' : 'Submit Quiz'}
                </button>
            </form>
        </div>
    );
};

export default QuizAttempt;
