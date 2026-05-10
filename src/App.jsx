import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/AdminLayout';

// Pages
import Dashboard from './pages/Dashboard';
import BusinessTypes from './pages/BusinessTypes';
import Clients from './pages/Clients';
import Products from './pages/Products';
import Users from './pages/Users';
import Deliveries from './pages/Deliveries';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas de Administrador */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="business-types" element={<BusinessTypes />} />
          <Route path="clients" element={<Clients />} />
          <Route path="products" element={<Products />} />
          <Route path="users" element={<Users />} />
          <Route path="deliveries" element={<Deliveries />} />
        </Route>
      </Route>

      {/* Rutas de Emprendedor */}
      <Route element={<ProtectedRoute requiredRole="emprendedor" />}>
        <Route path="/emprendedor" element={<AdminLayout />}>
          <Route index element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="deliveries" element={<Deliveries />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
