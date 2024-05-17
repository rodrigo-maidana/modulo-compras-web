import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../axiosInstance";
import { TablaPedidoCompra } from "../tablas/TablaPedidoCompra";
import ListarDetalleTabla from "../listados/ListarDetalleTabla";

const ModalPedidosDetalles = ({ id, show, handleClose, onSave }) => {
  const [detalles, setDetalles] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);

  const handleAgregarProducto = (producto, cantidad) => {
    const productoConCantidad = { ...producto, cantidad };
    setDetalles((prevDetalles) => [...prevDetalles, productoConCantidad]);
  };

  const handleEditarCantidad = (producto) => {
    setEditandoProducto(producto);
    setNuevaCantidad(producto.cantidad);
  };

  const handleGuardarCantidad = () => {
    setDetalles((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.id === editandoProducto.id
          ? { ...detalle, cantidad: nuevaCantidad }
          : detalle
      )
    );
    setEditandoProducto(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoProducto(null);
  };

  const handleEliminarProducto = (idProducto) => {
    setDetalles((prevDetalles) =>
      prevDetalles.filter((detalle) => detalle.id !== idProducto)
    );
  };

  const handleReset = () => {
    setDetalles([]);
  };

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const response = await axiosInstance.get(
          `https://api.rodrigomaidana.com:8080/pedidoscompra/detalles/${id}`
        );
        setDetalles(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
      }
    };

    if (id) {
      fetchDetalles();
    } else {
      handleReset();
    }
  }, [id]);

  const handleSave = async () => {
    try {
      const updatedDetalles = detalles.map((detalle) => ({
        id: detalle.id,
        producto: detalle.producto,
        cantidad: detalle.cantidad,
      }));
      console.log(id);
      await axiosInstance.put(
        `https://api.rodrigomaidana.com:8080/pedidosdetalles/${id}`,
        { detalles: updatedDetalles }
      );

      console.log("Pedido actualizado:", updatedDetalles);
      onSave(updatedDetalles);
    } catch (error) {
      console.error("Error al actualizar el pedido:", error);
    }
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Pedido N°{id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!id && (
          <TablaPedidoCompra handleAgregarProducto={handleAgregarProducto} />
        )}
        <div>Listado de detalles</div>
        <ListarDetalleTabla
          detalles={detalles}
          editandoProducto={editandoProducto}
          nuevaCantidad={nuevaCantidad}
          handleGuardarCantidad={handleGuardarCantidad}
          handleCancelarEdicion={handleCancelarEdicion}
          handleEliminarProducto={handleEliminarProducto}
          handleEditarCantidad={handleEditarCantidad}
          setNuevaCantidad={setNuevaCantidad}
        />
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={handleClose}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Confirmar pedido
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPedidosDetalles;
