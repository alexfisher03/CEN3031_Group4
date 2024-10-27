import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './components/Login';
import MainPage from './components/MainPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  return (
      <Router>
          <Routes>
              {/* Route to Login page */}
              <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />

              {/* Protected route for MainPage, accessible only if authenticated */}
              <Route
                  path="/main"
                  element={
                      isAuthenticated ? <MainPage /> : <Navigate to="/" replace />
                  }
              />
          </Routes>
      </Router>
  );
}

export default App;