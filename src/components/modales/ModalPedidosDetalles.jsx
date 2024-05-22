import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axiosInstance from "../axiosInstance";
import { TablaProductoPedido } from "../tablas/TablaProductoPedido";
import ListarDetalleTabla from "../listados/ListarDetalleTabla";

//por ahora fingir demencia cuando se cargan productos iguales
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
    try {
      const responsePreview = await axiosInstance.get(
        `/pedidos-compra/preview`
      );
      const pedidoCompra = {
        fechaEmision: responsePreview.data.fechaEmision,
        estado: "pendiente",
        nroPedido: responsePreview.data.nroPedido,
      };

      const responsePedidoCompra = await axiosInstance.post(
        `/pedidos-compra`,
        pedidoCompra
      );
      const pedidoCompraId = responsePedidoCompra.data.id;

      await Promise.all(
        detalles.map(async (detalle) => {
          const pedidoDetalle = {
            producto: {
              id: detalle.producto.id,
              descripcion: detalle.producto.descripcion,
              marca: {
                id: detalle.producto.marca.id,
                nombre: detalle.producto.marca.nombre,
              },
              categoria: {
                id: detalle.producto.categoria.id,
                nombre: detalle.producto.categoria.nombre,
              },
            },
            cantidad: detalle.cantidad,
          };

          await axiosInstance.post(
            `/pedidos-detalles/${pedidoCompraId}`,
            pedidoDetalle
          );
        })
      );

      console.log("Pedido guardado correctamente");
      onSave();
      handleClose();
    } catch (error) {
      console.log("Error al guardar el pedido:", error);
    }
  };

  const handleCancel = () => {
    handleClose();
    handleReset();
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
