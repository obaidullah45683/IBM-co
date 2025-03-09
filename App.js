import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/Login';
import ManagerDashboard from './components/ManagerDashboard';
import EmployeeDashboard from './components/EmployeeDashboard';
import './App.css';

function App() {
  const [user, setUser] = useState(null);

  const handleLogin = (username) => {
    // Simple role-based example (you might want to fetch user details from an API)
    if (username === 'manager') {
      setUser({ role: 'manager' });
    } else {
      setUser({ role: 'employee' });
    }
  };

  return (
    <BrowserRouter>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'manager' ? (
                  <Navigate to="/manager-dashboard" />
                ) : (
                  <Navigate to="/employee-dashboard" />
                )
              ) : (
                <Login onLogin={handleLogin} />
              )
            }
          />
          <Route
            path="/manager-dashboard"
            element={
              user && user.role === 'manager' ? (
                <ManagerDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
          <Route
            path="/employee-dashboard"
            element={
              user && user.role === 'employee' ? (
                <EmployeeDashboard />
              ) : (
                <Navigate to="/" />
              )
            }
          />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;