import React, { useState, useEffect } from 'react';
import { getTeacherQuizzes, deleteQuiz } from '../../services/api';
import './TeacherQuizzes.css';

const TeacherQuizzes = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchQuizzes = async () => {
            try {
                const response = await getTeacherQuizzes();
                setQuizzes(response.data);
            } catch (err) {
                setError('Failed to fetch quizzes.');
            } finally {
                setLoading(false);
            }
        };
        fetchQuizzes();
    }, []);

    const handleDelete = async (quizId) => {
        if (window.confirm('Are you sure you want to delete this quiz?')) {
            try {
                await deleteQuiz(quizId);
                setQuizzes(quizzes.filter(q => q._id !== quizId));
            } catch (err) {
                setError('Failed to delete quiz.');
            }
        }
    };
    
    if (loading) return <div>Loading...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="quiz-list-container">
            <h2>My Quizzes</h2>
            {quizzes.length === 0 ? (
                <p>You haven't created any quizzes yet.</p>
            ) : (
                <div className="quiz-grid">
                    {quizzes.map(quiz => (
                        <div key={quiz._id} className="quiz-card-manage">
                            <h3>{quiz.title}</h3>
                            <p>{quiz.description}</p>
                            <div className="quiz-actions">
                                <button className="btn-edit">Edit</button>
                                <button onClick={() => handleDelete(quiz._id)} className="btn-delete">Delete</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TeacherQuizzes;
