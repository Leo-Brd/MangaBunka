import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import ErrorPage from './pages/errorPage/errorPage';
import Header from './components/header/header';
import Footer from './components/footer/footer';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Router>

      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/quizz/selection" element={<Signup />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Footer />

    </Router>

  </StrictMode>,
);
