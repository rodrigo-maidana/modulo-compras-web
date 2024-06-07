import React, { useEffect, useState } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../axiosInstance";

const ModalDetalleOrdenPago = ({ show, handleClose, ordenPagoId }) => {
  const [detalles, setDetalles] = useState([]);
  const [ordenPago, setOrdenPago] = useState(null);
  useEffect(() => {
    if (ordenPagoId) {
      fetchFactura();
      fetchDetalles();
    }
  }, [ordenPagoId]);
  const fetchFactura = async () => {
    try {
      const response = await axiosInstance.get(`ordenes-compra/${ordenPagoId}`);
      setOrdenPago(response.data);
    } catch (error) {
      console.log("error al cargar factura: ", error);
    }
  };
  const fetchDetalles = async () => {
    try {
      const response = await axiosInstance.get(
        `orden-pago/${ordenPagoId}/detalles`
      );
      setDetalles(response.data);
    } catch (e) {
      console.log("Error al obtener detalles de la orden de pago", e);
    }
  };
  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };
  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Detalles de la Orden de Pago</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p className="my-1">
          <font size="4">
            <b>Proveedor: </b>
            {ordenPago ? ordenPago.proveedor.nombre : ""}
          </font>
        </p>
        <p className="my-1 mb-3">
          <font size="4">
            <b>Fecha emision: </b>
            {ordenPago ? formatearFecha(ordenPago.fechaEmision) : ""}
          </font>
        </p>
        <table className="table table-light table-bordered">
          <thead>
            <tr>
              <th>Método de Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map((detalle, index) => (
              <tr key={index}>
                <td>
                  {detalles ? formatearNumero(detalle.metodoPago.nombre) : ""}
                </td>
                <td>{detalle ? formatearNumero(detalle.monto) : ""}</td>
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
