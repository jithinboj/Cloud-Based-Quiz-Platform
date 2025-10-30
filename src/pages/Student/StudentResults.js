import React, { useState, useEffect } from 'react';
import { getStudentResults } from '../../services/api';
import './StudentResults.css';

const StudentResults = () => {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchResults = async () => {
            try {
                const response = await getStudentResults();
                setResults(response.data);
            } catch (err) {
                setError('Failed to fetch results.');
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, []);

    if (loading) return <div>Loading results...</div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="results-container">
            <h2>My Quiz Results</h2>
            {results.length === 0 ? (
                <p>You have not completed any quizzes yet.</p>
            ) : (
                <ul className="results-list">
                    {results.map(result => (
                        <li key={result._id} className="result-item">
                            <span className="quiz-title">{result.quiz.title}</span>
                            <span className="score">
                                Score: <strong>{result.score} / {result.totalQuestions}</strong>
                            </span>
                             <span className="date">
                                Completed on: {new Date(result.createdAt).toLocaleDateString()}
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default StudentResults;
