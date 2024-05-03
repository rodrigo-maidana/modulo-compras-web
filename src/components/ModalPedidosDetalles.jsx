import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from 'axios';  // Importa Axios

const ModalPedidosDetalles = ({ id, show, onHide }) => {
  const [detalles, setDetalles] = useState([]);

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const response = await axios.get(`https://api.rodrigomaidana.com:8080/pedidoscompra/detalles/${id}`);
        setDetalles(response.data);
      } catch (error) {
        console.error('Error al cargar los detalles del pedido:', error);
      }
    };

    if (id) {
      fetchDetalles();
    }
  }, [id]);

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Pedido N°{id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <table className='table table-dark table-striped table-bordered'>
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {detalles.map(item => (
              <tr key={item.id}>
                <td>{item.producto.id}</td>
                <td>{item.producto.descripcion}</td>
                <td>{item.producto.categoria.nombre}</td>
                <td>{item.cantidad}</td>
                <td>
                  <Button variant="danger">Eliminar</Button>
                  <Button variant="primary">Modificar</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Cerrar</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPedidosDetalles;