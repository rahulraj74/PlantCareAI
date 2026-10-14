import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './services/auth';

import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ChatWidget from './components/chat/ChatWidget';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DetectDisease from './pages/DetectDisease';
import DiagnosisResult from './pages/DiagnosisResult';
import ScanHistory from './pages/ScanHistory';
import DiseaseLibrary from './pages/DiseaseLibrary';
import CropCare from './pages/CropCare';
import Weather from './pages/Weather';
import Reports from './pages/Reports';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import Settings from './pages/Settings';

export function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-sans selection:bg-brand-200 selection:text-brand-900">
          
          {/* Navigation Bar */}
          <Navbar />

          {/* Main View Area */}
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/detect" element={<DetectDisease />} />
              <Route path="/diagnosis/:id" element={<DiagnosisResult />} />
              <Route path="/history" element={<ScanHistory />} />
              <Route path="/library" element={<DiseaseLibrary />} />
              <Route path="/crop-care" element={<CropCare />} />
              <Route path="/weather" element={<Weather />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              {/* Catch-all redirect to Home */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>

          {/* Grounded Agricultural Assistant Floating Chat */}
          <ChatWidget />

          {/* Footer with Educational & Extension Disclaimers */}
          <Footer />

        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
