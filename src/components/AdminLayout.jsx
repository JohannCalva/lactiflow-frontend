import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import TopNavbar from './Navbar';
import { Container } from 'react-bootstrap';

const AdminLayout = () => {
  return (
    <div className="d-flex layout-wrapper">
      <Sidebar />
      <div className="content-wrapper flex-grow-1 bg-light">
        <TopNavbar />
        <Container fluid className="px-4 pb-4">
          <Outlet />
        </Container>
      </div>
    </div>
  );
};

export default AdminLayout;
