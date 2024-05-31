import React, { useEffect, useState } from "react";
import { TablaPedidoCotizacion } from "../tablas/TablaPedidoCotizacion";
import ModalDetallesCotizacion from "../modales/ModalDetallesCotizacion";
import axiosInstance from "../axiosInstance";
export const ListadoPedidoCotizacion = () => {
  const [pedidoCotizacion, setPedidoCotizacion] = useState([]);
  const [cotizacionSelected, setCotizacionSelected] = useState(null);
  const [show, setShow] = useState(false);

  const fetchCargarPedidos = () => {
    axiosInstance
      .get("/cotizaciones")
      .then((response) => {
        console.log("response", response.data);
        setPedidoCotizacion(response.data);
      })
      .catch((e) => console.log("error al cargar pedidos cotizacion", e));
  };
  useEffect(() => fetchCargarPedidos(), []);

  const deletePedido = () => {};
  const handleEditarPedido = (cotizacion) => {
    setCotizacionSelected(cotizacion);
    setShow(true);
    //console.log("llego");
  };
  const handleCrearPedido = () => {};
  const formatearFecha = (fecha) => {
    const fechaEmision = new Date(fecha);
    const año = fechaEmision.getFullYear();
    const mes = fechaEmision.getMonth() + 1;
    const dia = fechaEmision.getDate();
    return `${dia < 10 ? "0" + dia : dia}-${mes < 10 ? "0" + mes : mes}-${año}`;
  };
  const handleClose = () => {
    setShow(false);
  };
  const onSave = () => {
    setShow(false);
    fetchCargarPedidos();
  };
  return (
    <>
      <TablaPedidoCotizacion
        pedidos={pedidoCotizacion}
        handleEditarPedido={handleEditarPedido}
        handleCrearPedido={handleCrearPedido}
        formatearFecha={formatearFecha}
      />
      {/**  Comentar porque a veces no anda el server local (quien sabe por que) */}
      {show && cotizacionSelected && (
        <ModalDetallesCotizacion
          cotizacion={cotizacionSelected}
          show={show}
          handleClose={handleClose}
          onSave={onSave}
          formatearFecha={formatearFecha}
        />
      )}
    </>
  );
};
