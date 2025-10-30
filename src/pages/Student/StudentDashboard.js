import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import '../Teacher/Dashboard.css'; // Reusing the same dashboard styles

const StudentDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
      <p className="dashboard-subtitle">Ready to test your knowledge? Choose an option below.</p>
      
      <div className="dashboard-cards">
        <Link to="/student/quizzes" className="dashboard-card">
          <div className="card-icon">📝</div>
          <h3 className="card-title">View Quizzes</h3>
          <p className="card-description">Browse and attempt available quizzes.</p>
        </Link>
        
        <Link to="/student/results" className="dashboard-card">
          <div className="card-icon">🏆</div>
          <h3 className="card-title">My Results</h3>
          <p className="card-description">Check your scores and performance on past quizzes.</p>
        </Link>
      </div>
    </div>
  );
};

export default StudentDashboard;
