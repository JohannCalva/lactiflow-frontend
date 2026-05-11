import React, { useState, useEffect } from 'react';
import { Button, Alert, Form, Badge } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import userService from '../services/user.service';

const Users = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    is_active: true
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Correo Electrónico', key: 'email' },
    { 
      label: 'Rol', 
      key: 'role',
      render: (row) => (
        <Badge bg={row.role === 'admin' ? 'danger' : 'info'} pill>
          {row.role === 'admin' ? 'Administrador' : 'Emprendedor'}
        </Badge>
      )
    },
    { label: 'Estado', key: 'is_active' }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await userService.getAll();
      setData(response.data);
    } catch (err) {
      setError('Error al cargar la lista de usuarios');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenCreate = () => {
    setFormData({
      name: '',
      email: '',
      password: '',
      role: '',
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
      email: row.email || '',
      password: '', // Siempre vacío al editar
      role: row.role || '',
      is_active: row.is_active !== undefined ? row.is_active : true
    });
    setIsEditing(true);
    setCurrentId(row.id);
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar al usuario "${row.name}"?`)) {
      try {
        await userService.remove(row.id);
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data?.error || '';
        setError(errorMsg || 'Error al eliminar el usuario');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setModalError('');
    setIsSubmitting(true);

    try {
      const payload = { ...formData };
      
      if (isEditing) {
        if (!payload.password) {
          delete payload.password;
        }
        await userService.update(currentId, payload);
      } else {
        await userService.create(payload);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      const errorMsg = err.response?.data?.error || '';
      if (errorMsg.toLowerCase().includes('duplicate') || errorMsg.toLowerCase().includes('unique') || errorMsg.toLowerCase().includes('correo') || errorMsg.toLowerCase().includes('email')) {
        setModalError('Este correo electrónico ya está registrado. Por favor, usa otro.');
      } else {
        setModalError(errorMsg || 'Error al guardar el usuario');
      }
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
          <h2 className="mb-0 text-dark fw-bold">Usuarios</h2>
          <p className="text-muted mb-0">Gestión de accesos y credenciales</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm px-4 rounded-pill">
          + Nuevo Usuario
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
        title={isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      >
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Nombre Completo</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ej. Juan Pérez"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Correo Electrónico</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            placeholder="correo@ejemplo.com"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Contraseña {isEditing && <span className="text-muted fw-normal">(Opcional si no deseas cambiarla)</span>}</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required={!isEditing}
            placeholder={isEditing ? "Dejar en blanco para mantener la actual" : "Ingresa una contraseña segura"}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Rol del Sistema</Form.Label>
          <Form.Select 
            name="role" 
            value={formData.role} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona un rol...</option>
            <option value="admin">Administrador (Acceso Total)</option>
            <option value="emprendedor">Emprendedor (Acceso Limitado)</option>
          </Form.Select>
        </Form.Group>

        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Check 
              type="switch"
              id="is_active_user_switch"
              name="is_active"
              label="Usuario Activo (Permite Iniciar Sesión)"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}
      </CrudModal>
    </>
  );
};

export default Users;
