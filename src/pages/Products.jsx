import React, { useState, useEffect } from 'react';
import { Button, Alert, Form, Row, Col } from 'react-bootstrap';
import DataTable from '../components/DataTable';
import CrudModal from '../components/CrudModal';
import productService from '../services/product.service';

const Products = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    unit: '',
    size: '',
    price: '',
    shelf_life_days: '',
    is_active: true
  });
  const [modalError, setModalError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const columns = [
    { label: 'Nombre', key: 'name' },
    { label: 'Presentación', key: 'formatted_size' },
    { label: 'Precio', key: 'formatted_price' },
    { label: 'Vida Útil', key: 'formatted_shelf_life' },
    { label: 'Estado', key: 'is_active' }
  ];

  const fetchData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await productService.getAll();
      const mappedData = response.data.map(product => {
        // Formatear precio
        const priceNum = Number(product.price);
        const formatted_price = !isNaN(priceNum) ? `$${priceNum.toFixed(2)}` : '$0.00';

        // Formatear tamaño y unidad
        let unitText = product.unit;
        // Pluralización básica
        if (product.size == 1 && unitText === 'litros') unitText = 'litro';
        if (product.size == 1 && unitText === 'unidades') unitText = 'unidad';
        const formatted_size = `${product.size} ${unitText}`;

        // Formatear días
        const formatted_shelf_life = `${product.shelf_life_days} días`;

        return {
          ...product,
          formatted_price,
          formatted_size,
          formatted_shelf_life
        };
      });
      setData(mappedData);
    } catch (err) {
      setError('Error al cargar el catálogo de productos');
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
      unit: '',
      size: '',
      price: '',
      shelf_life_days: '',
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
      unit: row.unit || '',
      size: row.size || '',
      price: row.price || '',
      shelf_life_days: row.shelf_life_days || '',
      is_active: row.is_active !== undefined ? row.is_active : true
    });
    setIsEditing(true);
    setCurrentId(row.id);
    setModalError('');
    setShowModal(true);
  };

  const handleDelete = async (row) => {
    if (window.confirm(`¿Estás seguro de que deseas eliminar el producto "${row.name}"?`)) {
      try {
        await productService.remove(row.id);
        fetchData();
      } catch (err) {
        const errorMsg = err.response?.data?.error || '';
        if (errorMsg.toLowerCase().includes('foreign') || errorMsg.toLowerCase().includes('constraint') || errorMsg.toLowerCase().includes('violates') || errorMsg.toLowerCase().includes('referenciado')) {
          setError('No se puede eliminar porque este producto tiene entregas asociadas');
        } else {
          setError(errorMsg || 'Error al eliminar el producto');
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
        await productService.update(currentId, formData);
      } else {
        await productService.create(formData);
      }
      setShowModal(false);
      fetchData();
    } catch (err) {
      setModalError(err.response?.data?.error || 'Error al guardar el producto');
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
          <h2 className="mb-0 text-dark fw-bold">Productos</h2>
          <p className="text-muted mb-0">Gestión de inventario y catálogo</p>
        </div>
        <Button variant="primary" onClick={handleOpenCreate} className="shadow-sm px-4 rounded-pill">
          + Nuevo Producto
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
        title={isEditing ? 'Editar Producto' : 'Nuevo Producto'}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
        error={modalError}
      >
        <Form.Group className="mb-3">
          <Form.Label className="fw-medium">Nombre del Producto</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            required
            placeholder="Ej. Yogur Natural, Queso Fresco..."
          />
        </Form.Group>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Tamaño / Cantidad</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="size"
                value={formData.size}
                onChange={handleInputChange}
                required
                placeholder="Ej. 1, 500, 2.5..."
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Unidad de Medida</Form.Label>
              <Form.Select
                name="unit"
                value={formData.unit}
                onChange={handleInputChange}
                required
              >
                <option value="">Selecciona unidad...</option>
                <option value="litros">Litros (L)</option>
                <option value="unidades">Unidades</option>
                <option value="kg">Kilogramos (kg)</option>
                <option value="gramos">Gramos (g)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        <Row className="mb-3">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Precio ($)</Form.Label>
              <Form.Control
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="0.00"
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Vida Útil (Días)</Form.Label>
              <Form.Control
                type="number"
                step="1"
                name="shelf_life_days"
                value={formData.shelf_life_days}
                onChange={handleInputChange}
                required
                placeholder="Ej. 15"
              />
            </Form.Group>
          </Col>
        </Row>

        {isEditing && (
          <Form.Group className="mb-3">
            <Form.Check
              type="switch"
              id="is_active_product_switch"
              name="is_active"
              label="Producto Activo"
              checked={formData.is_active}
              onChange={handleInputChange}
            />
          </Form.Group>
        )}
      </CrudModal>
    </>
  );
};

export default Products;
