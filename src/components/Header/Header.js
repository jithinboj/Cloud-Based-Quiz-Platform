import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './Header.css';

const Header = () => {
  const { isLoggedIn, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/'); // Redirect to home page after logout
  };

  const getDashboardLink = () => {
    if (user?.role === 'teacher') return '/teacher/dashboard';
    if (user?.role === 'student') return '/student/dashboard';
    return '/';
  };

  return (
    <header className="app-header">
      <div className="header-content">
        <Link to={isLoggedIn ? getDashboardLink() : '/'} className="logo-link">
          <h1>Quiz Platform</h1>
        </Link>
        <nav>
          {isLoggedIn ? (
            <>
              <span className="welcome-message">Welcome, {user?.name || 'User'}!</span>
              <button onClick={handleLogout} className="logout-button">Logout</button>
            </>
          ) : (
             <span className="header-prompt">Please select your role to begin.</span>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
