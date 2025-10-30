import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';

// Global Components
import Header from './components/Header/Header';
import ProtectedRoute from './guards/ProtectedRoute';

// Pages
import RoleSelect from './pages/Auth/RoleSelect';
import Login from './pages/Auth/Login';
import Signup from './pages/Auth/Signup';

// Teacher Pages
import TeacherDashboard from './pages/Teacher/TeacherDashboard';
import QuizCreate from './pages/Teacher/QuizCreate';
import TeacherQuizzes from './pages/Teacher/TeacherQuizzes';
import TeacherResults from './pages/Teacher/TeacherResults';

// Student Pages
import StudentDashboard from './pages/Student/StudentDashboard';
import QuizList from './pages/Student/QuizList';
import QuizAttempt from './pages/Student/QuizAttempt';
import StudentResults from './pages/Student/StudentResults';

function App() {
  return (
    <div className="App">
      <Header />
      <main className="main-content">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<RoleSelect />} />
          <Route path="/login/:role" element={<Login />} />
          <Route path="/signup/:role" element={<Signup />} />

          {/* Teacher Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['teacher']} />}>
            <Route path="/teacher/dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher/quizzes" element={<TeacherQuizzes />} />
            <Route path="/teacher/quiz/create" element={<QuizCreate />} />
            <Route path="/teacher/results" element={<TeacherResults />} />
          </Route>

          {/* Student Protected Routes */}
          <Route element={<ProtectedRoute allowedRoles={['student']} />}>
            <Route path="/student/dashboard" element={<StudentDashboard />} />
            <Route path="/student/quizzes" element={<QuizList />} />
            <Route path="/student/quiz/attempt/:quizId" element={<QuizAttempt />} />
            <Route path="/student/results" element={<StudentResults />} />
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<h1>404 Not Found</h1>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
