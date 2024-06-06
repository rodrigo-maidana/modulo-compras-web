import React, { useEffect, useState } from "react";
import { TablaPedidoCotizacion } from "../tablas/TablaPedidoCotizacion";
import ModalDetallesCotizacion from "../modales/ModalDetallesCotizacion";
import axiosInstance from "../axiosInstance";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "jspdf-autotable";
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
  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const handleCrearPDF = (cotizacion) => {
    axiosInstance
      .get(`/cotizaciones/${cotizacion.id}/detalles`)
      .then((response) => {
        const detalles = response.data;
        const doc = new jsPDF();

        // Cabecera
        doc.setFontSize(18);
        doc.text(`Cotización N° ${cotizacion.nroCotizacion}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Proveedor: ${cotizacion.proveedor.nombre}`, 14, 32);
        doc.text(`Fecha: ${formatearFecha(cotizacion.fechaEmision)}`, 14, 42);
        doc.text(
          `Nro pedido compra: ${cotizacion.pedidoCompra.nroPedido}`,
          14,
          52
        );

        // Tabla de productos
        const columns = ["Producto", "Cantidad", "Precio Unitario"];
        const rows = detalles.map((detalle) => [
          detalle.producto.descripcion,
          detalle.cantidad,
          detalle.precioUnitario,
        ]);

        doc.autoTable({
          startY: 62,
          head: [columns],
          body: rows,
        });

        doc.save(`Cotizacion_${cotizacion.nroCotizacion}.pdf`);
      })
      .catch((e) => console.log("error al cargar detalles de cotizacion", e));
  };

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
        handleCrearPDF={handleCrearPDF}
        formatearFecha={formatearFecha}
      />
      {show && cotizacionSelected && (
        <ModalDetallesCotizacion
          cotizacion={cotizacionSelected}
          show={show}
          handleClose={handleClose}
          onSave={onSave}
          formatearFecha={formatearFecha}
          formatearNumero={formatearNumero}
        />
      )}
    </>
  );
};
