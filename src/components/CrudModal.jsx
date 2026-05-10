import React from 'react';
import { Modal, Button, Form, Alert, Spinner } from 'react-bootstrap';

const CrudModal = ({ show, onHide, title, children, onSubmit, isSubmitting, error }) => {
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
      <Modal.Header closeButton className="border-bottom-0 pb-0">
        <Modal.Title className="fw-bold">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="pt-3">
        {error && <Alert variant="danger" className="py-2">{error}</Alert>}
        <Form id="crud-form" onSubmit={onSubmit}>
          {children}
        </Form>
      </Modal.Body>
      <Modal.Footer className="border-top-0">
        <Button variant="light" onClick={onHide} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button variant="primary" type="submit" form="crud-form" disabled={isSubmitting} className="px-4">
          {isSubmitting ? (
            <>
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
              Guardando...
            </>
          ) : (
            'Guardar'
          )}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CrudModal;
