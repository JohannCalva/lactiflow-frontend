import React, { useState, useEffect } from 'react';
import { Button, Alert, Form } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import businessTypeService from '../services/businessType.service';

const BusinessTypes = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '' });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Descripción', key: 'description' }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await businessTypeService.getAll();
      setData(response.data);
    } catch (err) {
      setError('Error al cargar los tipos de negocio');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({ name: '', description: '' });
    setIsEditing(false);
    setCurrentId(null);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (row) => {
    setFormData({ name: row.name, description: row.description || '' });
    setIsEditing(true);
    setCurrentId(row.id);
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el tipo de negocio "${row.name}"?`)) {
      try {
        await businessTypeService.remove(row.id);
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data?.error || '';
        if (errorMsg.toLowerCase().includes('foreign') || errorMsg.toLowerCase().includes('constraint') || errorMsg.toLowerCase().includes('violates') || errorMsg.toLowerCase().includes('referenciado')) {
          setError('No se puede eliminar porque tiene clientes asociados');
        } else {
          setError(errorMsg || 'Error al eliminar el registro');
        }
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await businessTypeService.update(currentId, formData);
      } else {
        await businessTypeService.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Error al guardar el registro');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark fw-bold">Tipos de Negocio</h2>
          <p className="text-muted mb-0">Gestiona las categorías de tus clientes</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm px-4 rounded-pill">
          + Nuevo Tipo
        </Button>
      </div>

      {error && <Alert variant="danger" dismissible onClose={() => setError('')} className="shadow-sm">{error}</Alert>}

      <DataTable 
        columns={columns} 
        data={data} 
        isLoading={isLoading} 
        onEdit={handleOpenEdit} 
        onDelete={handleDelete} 
      />

      <CrudModal
        show={showModal}
        onHide={() => setShowModal(false)}
        title={isEditing ? 'Editar Tipo de Negocio' : 'Nuevo Tipo de Negocio'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      >
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ej. Restaurante, Heladería..."
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Descripción (Opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Detalles sobre este tipo de negocio..."
          />
        </Form.Group>
      </CrudModal>
    </>
  );
};

export default BusinessTypes;
