import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../services/api'; // Use centralized API call
import './AuthStyles.css';

const Signup = () => {
  const { role } = useParams();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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

    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: role,
      };
      
      await signupUser(userData);
      
      // On successful signup, redirect to the login page
      navigate(`/login/${role}`);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed. Please try again.');
      setLoading(false);
    }
  };
  
  const title = role.charAt(0).toUpperCase() + role.slice(1);

  return (
    <div className="auth-container">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{title} Sign Up</h2>
        {error && <p className="error-message">{error}</p>}
        <div className="input-group">
          <label htmlFor="name">Full Name</label>
          <input type="text" id="name" name="name" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" onChange={handleChange} required />
        </div>
        <div className="input-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input type="password" id="confirmPassword" name="confirmPassword" onChange={handleChange} required />
        </div>
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? 'Signing Up...' : 'Sign Up'}
        </button>
        <p className="auth-switch">
          Already have an account? <Link to={`/login/${role}`}>Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Signup;
