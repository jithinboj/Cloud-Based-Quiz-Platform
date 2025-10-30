import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * A component that renders its children only if the user is authenticated
 * and has one of the allowed roles.
 * @param {object} props - The component props.
 * @param {string[]} props.allowedRoles - An array of roles allowed to access the route.
 */
const ProtectedRoute = ({ allowedRoles }) => {
  const { isLoggedIn, user, loading } = useAuth();
  
  // If authentication state is still loading, don't render anything yet
  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  // Check for authentication and role
  const isAuthorized = isLoggedIn && user && allowedRoles.includes(user.role);

  if (!isLoggedIn) {
    // If not logged in, redirect to the home page (role selection)
    return <Navigate to="/" replace />;
  }

  if (!isAuthorized) {
    // If logged in but role is not authorized, redirect to their own dashboard
    // This prevents a student from accessing teacher pages and vice-versa
    const homePath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
    return <Navigate to={homePath} replace />;
  }

  // If authenticated and authorized, render the child components
  return <Outlet />;
};

export default ProtectedRoute;
