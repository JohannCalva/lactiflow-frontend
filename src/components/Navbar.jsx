import React, { useContext } from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { AuthContext } from '../context/AuthContext';

const TopNavbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <Navbar bg="white" expand="lg" className="shadow-sm mb-4 px-4 top-navbar">
      <Container fluid>
        <Navbar.Brand className="d-lg-none fw-bold text-primary">Lactiflow</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav" className="justify-content-end">
          <Nav className="align-items-center">
            <span className="me-3 fw-medium">Hola, {user?.name || 'Usuario'}</span>
            <Button variant="outline-danger" size="sm" onClick={logout}>
              Cerrar Sesión
            </Button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default TopNavbar;
