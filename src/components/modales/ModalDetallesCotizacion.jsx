import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
//import axiosInstance from "../axiosInstance";
import axios from "axios";
const ModalDetallesCotizacion = ({ cotizacion, show, handleClose, onSave }) => {
  const [productos, setProductos] = useState([]);

  const fetchProductos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pedidos-cotizacion/detalles/${cotizacion.id}`
      );
      console.log(cotizacion.id);
      console.log(response.data.productos);
      //setProductos(response.data);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };
  useEffect(() => {
    fetchProductos();
  }, []);

  const handleGuardar = () => {
    // Implementar lógica de guardado
    //put de detalles para guardar el precio
  };

  const handleCancelar = () => {
    handleClose();
    setProductos([]);
  };

  return (
    <Modal show={show} onHide={handleCancelar} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>
          Detalles de la Cotización N°{cotizacion.nroPedidoCotizacion}
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Table bordered hover>
          <thead className="thead-dark">
            <tr>
              <th className="text-center">Producto</th>
              <th className="text-center">Cantidad</th>
              <th className="text-center">Precio Unitario</th>
            </tr>
          </thead>
          <tbody>
            {productos.map((producto) => (
              <tr key={producto.id}>
                <td className="text-center">{producto.nombre}</td>
                <td className="text-center">{producto.cantidad}</td>
                <td className="text-center">
                  <input type="number" className="form-control" />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-outline-secondary" onClick={handleCancelar}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleGuardar}>
          Guardar
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalDetallesCotizacion;
