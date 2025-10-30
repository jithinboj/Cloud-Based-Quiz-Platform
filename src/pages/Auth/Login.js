import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/api'; // Use centralized API call
import './AuthStyles.css';

const Login = () => {
  const { role } = useParams(); // 'student' or 'teacher'
  const { login } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!formData.email || !formData.password) {
        setError('Please fill in all fields.');
        setLoading(false);
        return;
    }

    try {
      // The backend needs to know the role for login validation
      const credentials = { ...formData, role }; 
      const response = await loginUser(credentials);
      
      // On success, the response should contain the user object and a token
      const { user, token } = response.data;
      
      // Use the login function from AuthContext
      login(user, token);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
      setLoading(false);
    }
  };

  const title = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{title} Login</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Logging In...' : 'Login'}
        </button>
        <p className="auth-switch">
          Don't have an account? <Link to={`/signup/${role}`}>Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
