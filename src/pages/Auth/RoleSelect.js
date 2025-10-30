import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthStyles.css'; // Shared styles for auth pages

const RoleSelect = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-container">
      <div className="auth-card role-select-card">
        <h2>Welcome to the Quiz Platform!</h2>
        <p>Please select your role to continue.</p>
        <div className="role-buttons">
          <button onClick={() => navigate('/login/teacher')} className="role-button teacher">
            I am a Teacher
          </button>
          <button onClick={() => navigate('/login/student')} className="role-button student">
            I am a Student
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleSelect;
