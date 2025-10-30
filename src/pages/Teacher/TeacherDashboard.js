import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Dashboard.css'; // Shared dashboard styles

const TeacherDashboard = () => {
  const { user } = useAuth();

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Welcome, {user?.name}!</h1>
      <p className="dashboard-subtitle">Manage your quizzes and view student results from here.</p>
      
      <div className="dashboard-cards">
        <Link to="/teacher/quiz/create" className="dashboard-card">
          <div className="card-icon">➕</div>
          <h3 className="card-title">Create New Quiz</h3>
          <p className="card-description">Design a new quiz with questions and answers.</p>
        </Link>
        
        <Link to="/teacher/quizzes" className="dashboard-card">
          <div className="card-icon">📚</div>
          <h3 className="card-title">Manage Quizzes</h3>
          <p className="card-description">View, edit, or delete your existing quizzes.</p>
        </Link>
        
        <Link to="/teacher/results" className="dashboard-card">
          <div className="card-icon">📊</div>
          <h3 className="card-title">View Results</h3>
          <p className="card-description">Check student submissions and scores for your quizzes.</p>
        </Link>
      </div>
    </div>
  );
};

export default TeacherDashboard;
