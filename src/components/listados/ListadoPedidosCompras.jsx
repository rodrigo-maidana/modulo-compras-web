import React, { useEffect, useState } from "react";
import ModalPedidosDetalles from "../modales/ModalPedidosDetalles";
import axiosInstance from "../axiosInstance";
import { TablaPedidoCompra } from "../tablas/TablaPedidoCompra";
import { Dropdown } from "react-bootstrap";

export const ListadoPedidosCompras = () => {
  const [pedidoCompras, setPedidoCompras] = useState([]);
  const [filteredPedidos, setFilteredPedidos] = useState([]);
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [show, setShow] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  const cotizacion = (id) => {
    setSelectedPedidoId(id);
    window.location.href = `/pedido-cotizacion/nuevo/${id}`;
  };

  const ordenCompra = (id) => {
    window.location.href = `/orden-compra/${id}`;
  };

  const handleCrearPedido = () => {
    setShow(true);
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
        setFilteredPedidos(response.data);
      })
      .catch((error) => {
        console.log("el error es: ", error);
      });
  };

  useEffect(() => {
    fetchCargarPedidos();
  }, []);

  useEffect(() => {
    let pedidosFiltrados = pedidoCompras;

    if (estadoFiltro) {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.estado === estadoFiltro
      );
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setDate(fin.getDate() + 1);
      pedidosFiltrados = pedidosFiltrados.filter((p) => {
        const fechaPedido = new Date(p.fechaEmision);
        return fechaPedido >= inicio && fechaPedido <= fin;
      });
    }

    setFilteredPedidos(pedidosFiltrados);
  }, [estadoFiltro, fechaInicio, fechaFin, pedidoCompras]);

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
      try {
        await axiosInstance.put(`/pedidos-compra/${pedido.id}`, pedidoObtenido);
        fetchCargarPedidos();
      } catch (error) {
        console.log("error al editar ", error);
      }
    }
  };

  const handleSave = (updatedDetalles) => {
    fetchCargarPedidos();
  };

  return (
    <>
      <TablaPedidoCompra
        pedidos={filteredPedidos}
        deletePedido={deletePedido}
        handleEditarPedido={handleEditarPedido}
        cotizacion={cotizacion}
        formatearFecha={formatearFecha}
        ordenCompra={ordenCompra}
        handleCrearPedido={handleCrearPedido}
        setEstadoFiltro={setEstadoFiltro}
        setFechaInicio={setFechaInicio}
        setFechaFin={setFechaFin}
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
