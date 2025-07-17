import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import ChatPage from './pages/ChatPage';
import HomePage from './pages/HomePage';
import Chat from './pages/chat';
import LoginPage from './pages/Login';
import SignUpPage from './pages/SignUp';
export default function App() {
  return (
    <Router>
      <Routes>
        
        <Route path="/chat" element={<ChatPage />} />
        <Route path="/HomePage" element={<HomePage />} />
        <Route path="/chattest" element={<Chat />} />
        <Route path="/LoginPage" element={<LoginPage />} />
        <Route path='/SignUp' element={<SignUpPage />} />
        
        {/* Add more routes as needed */}
      </Routes>
    </Router>
  );
}