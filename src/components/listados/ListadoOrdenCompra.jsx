import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { TablaOrdenCompra } from "../tablas/TablaOrdenCompra";
import { ModalDetallesOrdenCompra } from "../modales/ModalDetallesOrdenCompra";
import { ModalFacturaOrdenCompra } from "../modales/ModalFacturaOrdenCompra"

export const ListadoOrdenCompra = () => {
  const [ordenCompra, setOrdenCompra] = useState([]);
  const [ordenCompraSelected, setOrdenCompraSelected] = useState(null);
  const [show, setShow] = useState(false);
  const [showFactura, setShowFactura] = useState(false);
  const [idOrdenCompraFactura, setIdOrdenCompraFactura] = useState(null);

  const fetchCargarOrdenCompra = () => {
    axiosInstance
      .get("ordenes-compra")
      .then((response) => {
        console.log("response", response.data);
        setOrdenCompra(response.data);
      })
      .catch((e) => console.log("error al cargar ordenes de compra", e));
  };

  useEffect(() => fetchCargarOrdenCompra(), []);

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
    fetchCargarOrdenCompra();
  };

  const handleEditarOrden = (orden) => {
    setOrdenCompraSelected(orden);
    setShow(true);
  };

  const handleCrearOrden = () => {
    // Lógica para crear una nueva orden de compra
  };

  const handleAbrirFactura = (idOrdenCompra) => {
    setIdOrdenCompraFactura(idOrdenCompra);
    setShowFactura(true);
  };

  const handleCloseFactura = () => {
    setShowFactura(false);
  };

  return (
    <>
      <TablaOrdenCompra
        ordenCompra={ordenCompra}
        handleEditarOrden={handleEditarOrden}
        handleCrearOrden={handleCrearOrden}
        handleAbrirFactura={handleAbrirFactura}
        formatearFecha={formatearFecha}
      />
      {show && ordenCompraSelected && (
        <ModalDetallesOrdenCompra
          ordenCompra={ordenCompraSelected}
          show={show}
          handleClose={handleClose}
          onSave={onSave}
          formatearFecha={formatearFecha}
        />
      )}
      {showFactura && (
        <ModalFacturaOrdenCompra
          show={showFactura}
          handleClose={handleCloseFactura}
          idOrdenCompra={idOrdenCompraFactura}
          onSave={fetchCargarOrdenCompra}
        />
      )}
    </>
  );
};