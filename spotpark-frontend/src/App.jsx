import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ParkingSpotDetailPage from './pages/ParkingSpotDetailPage';
import DashboardPage from './pages/DashboardPage';
import AddParkingSpotPage from './pages/AddParkingSpotPage';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/parking-spots/new" element={
            <ProtectedRoute><AddParkingSpotPage /></ProtectedRoute>
          } />
          <Route path="/parking-spots/:id" element={<ParkingSpotDetailPage />} />
          <Route path="/dashboard" element={
            <ProtectedRoute><DashboardPage /></ProtectedRoute>
          } />
        </Routes>
      </main>
    </>
  );
}
