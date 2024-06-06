import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance";

export const ModalDetallesOrdenCompra = ({
  ordenCompra,
  show,
  handleClose,
  onSave,
  formatearFecha,
  formatearNumero,
}) => {
  const [detalles, setDetalles] = useState([]);

  const fetchDetalles = async () => {
    try {
      const response = await axiosInstance.get(
        `ordenes-compra/${ordenCompra.id}/detalles`
      );
      setDetalles(response.data);
    } catch (error) {
      console.log("Error al cargar los detalles de la orden de compra", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchDetalles();
    }
  }, [show]);

  const handleCancelar = () => {
    handleClose();
    setDetalles([]);
  };

  return (
    <>
      <Modal show={show} onHide={handleCancelar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-1">
              <font size="5" className="my-1">
                <b>
                  Detalles de la orden de compra N° {ordenCompra.nroOrdenCompra}
                </b>
              </font>
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">
            <font size="4">
              <b>Proveedor: </b>
              {ordenCompra.proveedor.nombre}
            </font>
          </p>
          <p className="mb-1">
            <font size="4">
              <b>Fecha:</b> {formatearFecha(ordenCompra.fechaEmision)}
            </font>
          </p>
          <p className="mb-1">
            <font size="4">
              <b>Estado:</b> {ordenCompra.estado}
            </font>
          </p>
          <Table bordered hover>
            <thead className="thead-dark">
              <tr>
                <th className="text-center">Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Precio Unitario</th>
                <th className="text-center">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle) => (
                <tr key={detalle.id}>
                  <td className="text-center">
                    {detalle.producto.descripcion}
                  </td>
                  <td className="text-center">{detalle.cantidad}</td>
                  <td className="text-center">
                    {formatearNumero(detalle.precioUnitario)} Gs
                  </td>
                  <td className="text-center">
                    {formatearNumero(detalle.cantidad * detalle.precioUnitario)}{" "}
                    Gs
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={handleCancelar}>
            Cerrar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
