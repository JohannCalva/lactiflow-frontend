import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
  const { isAuthenticated, user } = useContext(AuthContext);

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user?.role) {
    if (requiredRole === 'admin' && user.role !== 'admin') {
       return <Navigate to="/emprendedor/dashboard" replace />;
    }
    if (requiredRole === 'emprendedor' && user.role !== 'admin' && user.role !== 'emprendedor') {
       return <Navigate to="/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
