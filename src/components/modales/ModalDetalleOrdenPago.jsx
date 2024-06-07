import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../axiosInstance";

const ModalDetalleOrdenPago = ({ show, handleClose, ordenPagoId }) => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    if (ordenPagoId) {
      fetchDetalles();
    }
  }, [ordenPagoId]);

  const fetchDetalles = async () => {
    try {
      const response = await axiosInstance.get(
        `orden-pago/${ordenPagoId}/detalle`
      );
      setDetalles(response.data);
    } catch (e) {
      console.log("Error al obtener detalles de la orden de pago", e);
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Orden de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className="table">
          <thead>
            <tr>
              <th>Método de Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle, index) => (
              <tr key={index}>
                <td>{detalle.metodoPago.nombre}</td>
                <td>{detalle.monto}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetalleOrdenPago;
