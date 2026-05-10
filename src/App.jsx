import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<Login />} />
      
      {/* Rutas de Administrador */}
      <Route element={<ProtectedRoute requiredRole="admin" />}>
        <Route path="/admin/*" element={<div>Admin Layout (Pendiente Bloque 2)</div>} />
      </Route>

      {/* Rutas de Emprendedor */}
      <Route element={<ProtectedRoute requiredRole="emprendedor" />}>
        <Route path="/emprendedor/*" element={<div>Emprendedor Layout (Pendiente Bloque 2)</div>} />
      </Route>
    </Routes>
  );
}

export default App;
