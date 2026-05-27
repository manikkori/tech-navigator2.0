import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Careers from './pages/Careers'; 
import Users from './pages/Users';
import Roadmaps from './pages/Roadmaps';
import ResumeScan from './pages/ResumeScan';
import Assessment from './pages/Assessment';

// Baki placeholders
const RoadmapsPlaceholder = () => <Dashboard />;
const ResumePlaceholder = () => <Dashboard />;

function App() {
  return (
    <Router>
      <AuthProvider>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/careers" element={<Careers />} /> 
          <Route path="/users" element={<Users />} />
          <Route path="/roadmaps" element={<Roadmaps />} />
          <Route path="/resume-scan" element={<ResumeScan />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/roadmaps" element={<RoadmapsPlaceholder />} />
          <Route path="/resume-scan" element={<ResumePlaceholder />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;