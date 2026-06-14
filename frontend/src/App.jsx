// import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import TrainInfo from './pages/TrainInfo';
import AuthView from './pages/Login'; // Map both routes onto our dynamic visual controller
import Dashboard from './pages/Dashboard';

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <Router>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/train-info" element={<TrainInfo />} />
            <Route path="/login" element={<AuthView />} />
            <Route path="/signup" element={<AuthView />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
          <Footer />
        </Router>
      </BookingProvider>
    </AuthProvider>
  );
}