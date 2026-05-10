import React, { useState, useEffect } from 'react';
import { Button, Alert, Form } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import clientService from '../services/client.service';
import businessTypeService from '../services/businessType.service';

const Clients = () => {
  const [data, setData] = useState([]);
  const [businessTypes, setBusinessTypes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    business_type_id: '',
    client_type: '',
    address: '',
    phone: '',
    is_active: true
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Tipo de Negocio', key: 'business_type_name' },
    { label: 'Categoría', key: 'client_type' },
    { label: 'Dirección', key: 'address' },
    { label: 'Teléfono', key: 'phone' }
  ];

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [clientsRes, bTypesRes] = await Promise.all([
        clientService.getAll(),
        businessTypeService.getAll()
      ]);
      
      const mappedClients = clientsRes.data.map(client => ({
        ...client,
        business_type_name: client.business_type?.name || 'Desconocido'
      }));

      setData(mappedClients);
      setBusinessTypes(bTypesRes.data);
    } catch (err) {
      setError('Error al cargar la información de los clientes');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchClientsOnly = async () => {
    try {
      const clientsRes = await clientService.getAll();
      const mappedClients = clientsRes.data.map(client => ({
        ...client,
        business_type_name: client.business_type?.name || 'Desconocido'
      }));
      setData(mappedClients);
    } catch (err) {
      setError('Error al actualizar la tabla de clientes');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      business_type_id: '',
      client_type: '',
      address: '',
      phone: '',
      is_active: true
    });
    setIsEditing(false);
    setCurrentId(null);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (row) => {
    setFormData({
      name: row.name || '',
      business_type_id: row.business_type_id || '',
      client_type: row.client_type || '',
      address: row.address || '',
      phone: row.phone || '',
      is_active: row.is_active !== undefined ? row.is_active : true
    });
    setIsEditing(true);
    setCurrentId(row.id);
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al cliente "${row.name}"?`)) {
      try {
        await clientService.remove(row.id);
        fetchClientsOnly();
      } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar el cliente');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      if (isEditing) {
        await clientService.update(currentId, formData);
      } else {
        await clientService.create(formData);
      }
      setShowModal(false);
      fetchClientsOnly();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Error al guardar el cliente');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ 
      ...formData, 
      [name]: type === 'checkbox' ? checked : value 
    });
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-0 text-dark fw-bold">Clientes</h2>
          <p className="text-muted mb-0">Directorio y gestión de clientes</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm px-4 rounded-pill">
          + Nuevo Cliente
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
        title={isEditing ? 'Editar Cliente' : 'Nuevo Cliente'}
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
            placeholder="Nombre completo o razón social"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Tipo de Negocio</Form.Label>
          <Form.Select 
            name="business_type_id" 
            value={formData.business_type_id} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona un tipo de negocio...</option>
            {businessTypes.map(bt => (
              <option key={bt.id} value={bt.id}>{bt.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Categoría del Cliente</Form.Label>
          <Form.Select 
            name="client_type" 
            value={formData.client_type} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona una categoría...</option>
            <option value="A">A — Regular (compra en días fijos)</option>
            <option value="B">B — Frecuencia definida (no en días fijos)</option>
            <option value="C">C — Irregular</option>
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Dirección</Form.Label>
          <Form.Control
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            placeholder="Calle principal, ciudad"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            placeholder="Ej. +593 9..."
          />
        </Form.Group>

        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Check 
              type="switch"
              id="is_active_switch"
              name="is_active"
              label="Cliente Activo"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}
      </CrudModal>
    </>
  );
};

export default Clients;
