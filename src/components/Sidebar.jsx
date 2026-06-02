import React, { useContext } from "react";
import { Nav } from "react-bootstrap";
import { NavLink } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Sidebar = () => {
  const { user } = useContext(AuthContext);
  const isAdmin = user?.role === "admin";
  const basePath = isAdmin ? "/admin" : "/emprendedor";

  return (
    <div className="sidebar bg-dark text-white p-3">
      <h3 className="mb-4 text-center fw-bold text-primary">Lactiflow</h3>
      <Nav className="flex-column">
        {isAdmin && (
          <>
            <Nav.Link
              as={NavLink}
              to={`${basePath}/dashboard`}
              className="text-white mb-2 sidebar-link"
            >
              Dashboard
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/business-types"
              className="text-white mb-2 sidebar-link"
            >
              Tipos de Negocio
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/clients"
              className="text-white mb-2 sidebar-link"
            >
              Clientes
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/products"
              className="text-white mb-2 sidebar-link"
            >
              Productos
            </Nav.Link>
            <Nav.Link
              as={NavLink}
              to="/admin/users"
              className="text-white mb-2 sidebar-link"
            >
              Usuarios
            </Nav.Link>
          </>
        )}

        {!isAdmin && (
          <>
            <Nav.Link
              as={NavLink}
              to={`${basePath}/deliveries`}
              className="text-white mb-2 sidebar-link"
            >
              Entregas
            </Nav.Link>

            <Nav.Link
              as={NavLink}
              to={`${basePath}/suggestions`}
              className="text-white mb-2 sidebar-link"
            >
              Sugerencias
            </Nav.Link>
          </>
        )}
      </Nav>
    </div>
  );
};

export default Sidebar;
