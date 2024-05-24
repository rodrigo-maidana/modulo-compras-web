import React, { useEffect, useState } from "react";
import ModalPedidosDetalles from "../modales/ModalPedidosDetalles";
import axiosInstance from "../axiosInstance";
import { TablaPedidoCompra } from "../tablas/TablaPedidoCompra";

export const ListadoPedidosCompras = () => {
  const [pedidoCompras, setPedidoCompras] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [edit, setEdit] = useState(false);

  const handleCrearPedido = () => {
    setShow(true);
    setEdit(false);
    setSelectedPedidoId(null);
  };

  const handleEditarPedido = (id) => {
    setSelectedPedidoId(id);
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedPedidoId(null);
  };

  const obtenerPedido = async (id) => {
    try {
      const response = await axiosInstance.get(`/pedidos-compra/${id}`);
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log("error al querer obtener un pedido", e);
    }
  };

  const fetchCargarPedidos = () => {
    axiosInstance
      .get("/pedidos-compra")
      .then((response) => {
        setPedidoCompras(response.data);
        //console.log(response.data);
      })
      .catch((error) => {
        console.log("el error es: ", error);
      });
  };

  useEffect(() => {
    fetchCargarPedidos();
  }, []);

  const formatearFecha = (fecha) => {
    const fechaEmision = new Date(fecha);
    const año = fechaEmision.getFullYear();
    const mes = fechaEmision.getMonth() + 1;
    const dia = fechaEmision.getDate();
    return `${dia < 10 ? "0" + dia : dia}-${mes < 10 ? "0" + mes : mes}-${año}`;
  };

  const deletePedido = async (pedido) => {
    if (!pedido || !pedido.id) {
      console.log("El pedido no tiene un id válido:", pedido);
      return;
    }
    const pedidoObtenido = await obtenerPedido(pedido.id);
    if (pedidoObtenido) {
      pedidoObtenido.estado = "Cancelado";
      console.log(pedidoObtenido.estado);
      try {
        await axiosInstance.put(`/pedidos-compra/${pedido.id}`, pedidoObtenido);
        console.log("editado");
        fetchCargarPedidos();
      } catch (error) {
        console.log("error al editar ", error);
      }
    }
  };

  const handleSave = (updatedDetalles) => {
    console.log("Detalles actualizados: ", updatedDetalles);
    fetchCargarPedidos(); // Volver a cargar los pedidos si es necesario
  };

  return (
    <>
      {/*Hasta aca todo igual ambos componentes*/}
      <TablaPedidoCompra
        pedidos={pedidoCompras}
        deletePedido={deletePedido}
        handleEditarPedido={handleEditarPedido}
        handleCrearPedido={handleCrearPedido}
        formatearFecha={formatearFecha}
      />

      <ModalPedidosDetalles
        id={selectedPedidoId}
        show={show}
        handleClose={handleCloseModal}
        onSave={handleSave}
      />
    </>
  );
};

export default ListadoPedidosCompras;
