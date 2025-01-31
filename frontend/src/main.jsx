import React from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/home/home';
import Header from './components/header/header';
import Footer from './components/footer/footer';

createRoot(document.getElementById('root')).render(
  <StrictMode>

    <Header />

    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </Router>

    <Footer />

  </StrictMode>,
);
