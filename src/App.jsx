import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Menu from './pages/Menu';
import Panier from './pages/Panier';
import SuiviCommande from './pages/SuiviCommande';
import Profil from './pages/Profil';
import KDS from './pages/KDS';
import Dashboard from './pages/Dashboard';
import GestionMenu from './pages/GestionMenu';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/panier" element={<Panier />} />
          <Route path="/commandes/:id" element={<SuiviCommande />} />
          <Route path="/profil" element={<Profil />} />
          <Route path="/kds" element={<KDS />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/gestion-menu" element={<GestionMenu />} />
        </Routes>
      </CartProvider>
    </AuthProvider>
  );
}
