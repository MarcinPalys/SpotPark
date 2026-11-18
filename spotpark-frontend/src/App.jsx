import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParkingSpotDetailPage from './pages/ParkingSpotDetailPage';
import DashboardPage from './pages/DashboardPage';
import AddParkingSpotPage from './pages/AddParkingSpotPage';
import TermsPage from './pages/TermsPage';
import ScrollToTop from './components/ScrollToTop';

export default function App() {
  return (
    <>
      <ScrollToTop />
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/regulamin" element={<TermsPage />} />
          {/* Open without login for now — see AddParkingSpotPage (local save when logged out) */}
          <Route path="/parking-spots/new" element={<AddParkingSpotPage />} />
          <Route path="/parking-spots/:id" element={<ParkingSpotDetailPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}
