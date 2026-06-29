
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ChatInterface from './pages/ChatInterface';
import Login from './pages/Login';
import SpatialView from './pages/SpatialView';
import Dashboard from './pages/Dashboard';
import PowerOptimizer from './pages/PowerOptimizer';
import SpatialDigitalTwin from './pages/SpatialDigitalTwin';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Login />} />
                <Route path="/chat" element={<ChatInterface />} />
                <Route path="/spatial" element={<SpatialView />} />
                <Route path="/3d" element={<SpatialView />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/optimize" element={<PowerOptimizer />} />
                <Route path="/spatial-twin" element={<SpatialDigitalTwin />} />
                {/* Redirect unknown routes to home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </Router>
    );
}

export default App;
