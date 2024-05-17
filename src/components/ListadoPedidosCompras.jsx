import React, { useEffect, useState } from "react";
import ModalPedidosDetalles from "./ModalPedidosDetalles";
import axiosInstance from "./axiosInstance";
import { TabalPedidoCompra } from "./modales/TablaPedidoCompra";

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
      const response = await axiosInstance.get(
        `https://api.rodrigomaidana.com:8080/pedidoscompra/${id}`
      );
      console.log(response.data);
      return response.data;
    } catch (e) {
      console.log("error al querer obtener un pedido", e);
    }
  };

  const fetchCargarPedidos = () => {
    axiosInstance
      .get("https://api.rodrigomaidana.com:8080/pedidoscompra")
      .then((response) => {
        setPedidoCompras(response.data);
        console.log(response.data);
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
    return `${año}-${dia < 10 ? "0" + dia : dia}-${mes < 10 ? "0" + mes : mes}`;
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
        await axiosInstance.put(
          `https://api.rodrigomaidana.com:8080/pedidoscompra/${pedido.id}`,
          pedidoObtenido
        );
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
      <TabalPedidoCompra
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
