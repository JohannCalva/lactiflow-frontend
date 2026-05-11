import React from 'react';
import { Table, Button, Badge, Spinner } from 'react-bootstrap';

const DataTable = ({ columns, data, onEdit, onDelete, isLoading }) => {
  if (isLoading) {
    return (
      <div className="text-center my-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2 text-muted">Cargando datos...</p>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="alert alert-info text-center mt-3 shadow-sm">
        No hay registros para mostrar.
      </div>
    );
  }

  return (
    <div className="table-responsive bg-white shadow-sm rounded">
      <Table hover className="mb-0 align-middle">
        <thead className="bg-light text-muted">
          <tr>
            {columns.map((col, index) => (
              <th key={index} className="border-bottom-0 py-3">{col.label}</th>
            ))}
            <th className="border-bottom-0 py-3 text-end pe-4">Acciones</th>
          </tr>
        </thead>
        <tbody className="border-top-0">
          {data.map((row) => (
            <tr key={row.id} style={{ opacity: row.is_active === false ? 0.6 : 1 }}>
              {columns.map((col, index) => (
                <td key={index} className="py-3">
                  {col.key === 'is_active' ? (
                    <Badge bg={row[col.key] ? 'success' : 'secondary'} pill>
                      {row[col.key] ? 'Activo' : 'Inactivo'}
                    </Badge>
                  ) : col.render ? (
                    col.render(row)
                  ) : (
                    row[col.key] || <span className="text-muted fst-italic">N/A</span>
                  )}
                </td>
              ))}
              <td className="py-3 text-end pe-3" style={{ minWidth: '150px' }}>
                <Button variant="outline-primary" size="sm" className="me-2 rounded-pill px-3" onClick={() => onEdit(row)}>
                  Editar
                </Button>
                <Button variant="outline-danger" size="sm" className="rounded-pill px-3" onClick={() => onDelete(row)}>
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  );
};

export default DataTable;
