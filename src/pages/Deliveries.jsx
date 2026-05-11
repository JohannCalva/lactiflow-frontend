import React, { useState, useEffect } from 'react';
import { Button, Alert, Form, Row, Col } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import deliveryService from '../services/delivery.service';
import clientService from '../services/client.service';
import productService from '../services/product.service';
import userService from '../services/user.service';

const Deliveries = () => {
  const [data, setData] = useState([]);
  const [clients, setClients] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    client_id: '',
    product_id: '',
    user_id: '',
    quantity: '',
    delivered_at: '',
    notes: ''
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: 'Cliente', key: 'client_name' },
    { label: 'Producto', key: 'product_name' },
    { label: 'Responsable', key: 'user_name' },
    { label: 'Cantidad', key: 'quantity' },
    { 
      label: 'Fecha de Entrega', 
      key: 'delivered_at',
      render: (row) => row.delivered_at ? new Date(row.delivered_at + 'T00:00:00').toLocaleDateString() : 'N/A' 
    },
    { label: 'Día', key: 'day_of_week' }
  ];

  const fetchInitialData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [deliveriesRes, clientsRes, productsRes, usersRes] = await Promise.all([
        deliveryService.getAll(),
        clientService.getAll(),
        productService.getAll(),
        userService.getAll()
      ]);
      
      const mappedDeliveries = deliveriesRes.data.map(delivery => ({
        ...delivery,
        client_name: delivery.client?.name || 'Desconocido',
        product_name: delivery.product?.name || 'Desconocido',
        user_name: delivery.user?.name || 'Desconocido'
      }));

      setData(mappedDeliveries);
      
      // Filtrar clientes y productos activos si fuera necesario, aquí los mostramos todos
      setClients(clientsRes.data);
      setProducts(productsRes.data);
      setUsers(usersRes.data);
    } catch (err) {
      setError('Error al cargar la información de entregas');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDeliveriesOnly = async () => {
    try {
      const deliveriesRes = await deliveryService.getAll();
      const mappedDeliveries = deliveriesRes.data.map(delivery => ({
        ...delivery,
        client_name: delivery.client?.name || 'Desconocido',
        product_name: delivery.product?.name || 'Desconocido',
        user_name: delivery.user?.name || 'Desconocido'
      }));
      setData(mappedDeliveries);
    } catch (err) {
      setError('Error al actualizar la tabla de entregas');
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, []);

  const handleOpenCreate = () => {
    // Inicializar con la fecha de hoy
    const today = new Date().toISOString().split('T')[0];
    setFormData({
      client_id: '',
      product_id: '',
      user_id: '',
      quantity: '',
      delivered_at: today,
      notes: ''
    });
    setIsEditing(false);
    setCurrentId(null);
    setModalError('');
    setShowModal(true);
  };

  const handleOpenEdit = (row) => {
    setFormData({
      client_id: row.client_id || '',
      product_id: row.product_id || '',
      user_id: row.user_id || '',
      quantity: row.quantity || '',
      delivered_at: row.delivered_at ? row.delivered_at.split('T')[0] : '',
      notes: row.notes || ''
    });
    setIsEditing(true);
    setCurrentId(row.id);
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este registro de entrega?')) {
      try {
        await deliveryService.remove(row.id);
        fetchDeliveriesOnly();
      } catch (err) {
        setError(err.response?.data?.error || 'Error al eliminar la entrega');
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
        await deliveryService.update(currentId, payload);
      } else {
        await deliveryService.create(payload);
      }
      setShowModal(false);
      fetchDeliveriesOnly();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Error al guardar la entrega');
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
          <h2 className="mb-0 text-dark fw-bold">Registro de Entregas</h2>
          <p className="text-muted mb-0">Control diario de distribución a clientes</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm px-4 rounded-pill">
          + Nueva Entrega
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
        title={isEditing ? 'Editar Entrega' : 'Registrar Nueva Entrega'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      >
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Cliente Receptor</Form.Label>
          <Form.Select 
            name="client_id" 
            value={formData.client_id} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona un cliente...</option>
            {clients.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Producto Entregado</Form.Label>
          <Form.Select 
            name="product_id" 
            value={formData.product_id} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona un producto...</option>
            {products.map(p => (
              <option key={p.id} value={p.id}>{p.name} ({p.size} {p.unit})</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Cantidad</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="quantity"
                value={formData.quantity}
                onChange={handleInputChange}
                required
                placeholder="Ej. 10"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Fecha de Entrega</Form.Label>
              <Form.Control
                type="date"
                name="delivered_at"
                value={formData.delivered_at}
                onChange={handleInputChange}
                required
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Usuario Responsable</Form.Label>
          <Form.Select 
            name="user_id" 
            value={formData.user_id} 
            onChange={handleInputChange} 
            required
          >
            <option value="">Selecciona quién entrega...</option>
            {users.map(u => (
              <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Notas (Opcional)</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            name="notes"
            value={formData.notes}
            onChange={handleInputChange}
            placeholder="Alguna observación sobre la entrega..."
          />
        </Form.Group>
      </CrudModal>
    </>
  );
};

export default Deliveries;
