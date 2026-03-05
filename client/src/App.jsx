import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import SplashScreen from './pages/SplashScreen';
import LoginScreen from './pages/LoginScreen';
import DashboardScreen from './pages/DashboardScreen';
import ProjectsListScreen from './pages/ProjectsListScreen';
import ProjectDetailScreen from './pages/ProjectDetailScreen';
import GeoLocationScreen from './pages/GeoLocationScreen';
import BudgetScreen from './pages/BudgetScreen';
import BillingScreen from './pages/BillingScreen';
import MBListScreen, { MBEntryScreen } from './pages/MBScreen';
import ProfileScreen from './pages/ProfileScreen';
import AddProjectScreen from './pages/AddProjectScreen';

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<SplashScreen />} />
      <Route path="/login" element={<LoginScreen />} />
      <Route path="/dashboard" element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
      <Route path="/projects" element={<ProtectedRoute><ProjectsListScreen /></ProtectedRoute>} />
      <Route path="/projects/new" element={<ProtectedRoute><AddProjectScreen /></ProtectedRoute>} />
      <Route path="/project/:id" element={<ProtectedRoute><ProjectDetailScreen /></ProtectedRoute>} />
      <Route path="/geo/:id" element={<ProtectedRoute><GeoLocationScreen /></ProtectedRoute>} />
      <Route path="/budget" element={<ProtectedRoute><BudgetScreen /></ProtectedRoute>} />
      <Route path="/billing" element={<ProtectedRoute><BillingScreen /></ProtectedRoute>} />
      <Route path="/emb" element={<ProtectedRoute><MBListScreen /></ProtectedRoute>} />
      <Route path="/emb/new" element={<ProtectedRoute><MBEntryScreen /></ProtectedRoute>} />
      <Route path="/profile" element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OfflineProvider>
          <AppRoutes />
        </OfflineProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
