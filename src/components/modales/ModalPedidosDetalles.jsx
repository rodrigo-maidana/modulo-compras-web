import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../axiosInstance";
import { TablaProductoPedido } from "../tablas/TablaProductoPedido";
import ListarDetalleTabla from "../listados/ListarDetalleTabla";

const ModalPedidosDetalles = ({ id, show, handleClose, onSave }) => {
  const [detalles, setDetalles] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);

  const handleAgregarProducto = (producto, cantidad) => {
    console.log(producto);
    const productoConCantidad = {
      ...producto,
      producto: producto,
      cantidad,
    };
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
          `/pedidos-compra/detalles/${id}`
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
    //funcion para crear un pedido detalle
    //cargar la cabecera con https://api.rodrigomaidana.com:8080/pedidoscompra/preview
    try {
      await axiosInstance
        .get(`https://api.rodrigomaidana.com:8080/pedidoscompra/preview`)
        .then((response) => {
          //console.log(response.data);
          const pedidoCompra = {
            fechaEmision: response.data.fechaEmision,
            estado: "pendiente",
            nroPedido: response.data.nroPedido,
          };
          //console.log(pedidoCompra);
          axiosInstance
            .post(
              `https://api.rodrigomaidana.com:8080/pedidoscompra`,
              pedidoCompra
            )
            .then((response) => {
              //console.log(response.data);
            })
            .catch((error) =>
              console.log("error al cargar la cabecera", error)
            );
        })
        .catch((error) => console.log("error al cargar la cabecera", error));
    } catch {
      console.log("error al cargar la cabecera");
    }
    //hacer post a https://api.rodrigomaidana.com:8080/pedidoscompra en cascada de cada producto

    //funcion para actualizar los detalles
    /*
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
    handleReset(); // Limpia los detalles al cerrar el modal 
    */
  };

  const handleCancel = () => {
    handleClose();
    handleReset(); // Limpia los detalles al cerrar el modal
  };

  return (
    <Modal show={show} onHide={handleCancel} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Pedido N°{id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!id && (
          <TablaProductoPedido handleAgregarProducto={handleAgregarProducto} />
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
        <button className="btn btn-danger" onClick={handleCancel}>
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
