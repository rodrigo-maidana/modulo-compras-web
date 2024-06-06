import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { TablaOrdenCompra } from "../tablas/TablaOrdenCompra";
import { ModalDetallesOrdenCompra } from "../modales/ModalDetallesOrdenCompra";
import jsPDF from "jspdf";
import "jspdf-autotable";

const formatearNumero = (numero) => {
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

export const ListadoOrdenCompra = () => {
  const [ordenCompra, setOrdenCompra] = useState([]);
  const [ordenCompraSelected, setOrdenCompraSelected] = useState(null);
  const [show, setShow] = useState(false);

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

  const handleCrearPDF = (orden) => {
    axiosInstance
      .get(`/ordenes-compra/${orden.id}/detalles`)
      .then((response) => {
        const detalles = response.data;
        const doc = new jsPDF();

        // Cabecera
        doc.setFontSize(18);
        doc.text(`Orden de Compra N° ${orden.nroOrdenCompra}`, 14, 22);
        doc.setFontSize(12);
        doc.text(`Proveedor: ${orden.proveedor.nombre}`, 14, 32);
        doc.text(`Fecha: ${formatearFecha(orden.fechaEmision)}`, 14, 42);
        doc.text(`Estado: ${orden.estado}`, 14, 52);

        // Tabla de productos
        const columns = ["Producto", "Cantidad", "Precio Unitario", "Subtotal"];
        const rows = detalles.map((detalle) => [
          detalle.producto.descripcion,
          detalle.cantidad,
          formatearNumero(detalle.precioUnitario),
          formatearNumero(detalle.cantidad * detalle.precioUnitario),
        ]);

        const total = rows.reduce(
          (acc, row) => acc + parseFloat(row[3].replace(/\./g, "")),
          0
        );

        doc.autoTable({
          startY: 62,
          head: [columns],
          body: rows,
          foot: [["", "", "Total", formatearNumero(total)]],
        });

        doc.save(`OrdenCompra_${orden.nroOrdenCompra}.pdf`);
      })
      .catch((e) =>
        console.log("error al cargar detalles de orden de compra", e)
      );
  };

  return (
    <>
      {/*Ver donde se utiliza formatear numero en tabla orden compra */}
      <TablaOrdenCompra
        ordenCompra={ordenCompra}
        handleEditarOrden={handleEditarOrden}
        handleCrearPDF={handleCrearPDF}
        formatearFecha={formatearFecha}
      />
      {show && ordenCompraSelected && (
        <ModalDetallesOrdenCompra
          ordenCompra={ordenCompraSelected}
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
