import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Login from './pages/login/login';
import Signup from './pages/signup/signup';
import ErrorPage from './pages/errorPage/errorPage';
import GameModeSelection from './pages/gameModeSelection/gameModeSelection'
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
        <Route path="/quizz/gamemode" element={<GameModeSelection />} />
        <Route path="/quizz/all" element={<GameModeSelection />} />
        <Route path="/quizz/:difficulty" element={<GameModeSelection />} />
        <Route path="*" element={<ErrorPage />} />
      </Routes>

      <Footer />

    </Router>

  </StrictMode>,
);
