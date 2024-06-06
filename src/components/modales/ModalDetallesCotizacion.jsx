import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ModalDetallesCotizacion = ({
  cotizacion,
  show,
  handleClose,
  onSave,
  formatearFecha,
  formatearNumero,
}) => {
  const [detalles, setDetalles] = useState([]);
  const [registrado, setRegistrado] = useState(false);

  // Cargar detalles del pedido de cotización
  const fetchProductos = async () => {
    try {
      const response = await axiosInstance.get(
        `/cotizaciones/${cotizacion.id}/detalles`
      );
      const productos = response.data;
      setDetalles(productos);
      setRegistrado(
        productos.every((detalle) => parseInt(detalle.precioUnitario) > 0)
      );
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchProductos();
    }
  }, [show]);

  const handleGuardar = async () => {
    const allPriceSet = detalles.every(
      (producto) => producto.precioUnitario > 0
    );
    if (allPriceSet) {
      try {
        for (const detalle of detalles) {
          await axiosInstance.put(`cotizacion-detalles/${detalle.id}`, detalle);
        }
        cotizacion.estado = "Registrado";
        await axiosInstance.put(`cotizaciones/${cotizacion.id}`, cotizacion);
        cotizacion.pedidoCompra.estado = "Cotizado";
        await axiosInstance.put(
          `pedidos-compra/${cotizacion.pedidoCompra.id}`,
          cotizacion.pedidoCompra
        );
        onSave();
      } catch (error) {
        console.log("Error al registrar los precios de los productos", error);
        toast.error("Error al registrar los precios de los productos");
      }
    } else {
      toast.warning("Todos los productos deben tener precio mayor a 0");
    }
  };

  const handleCancelar = () => {
    handleClose();
    setDetalles([]);
    //toast.info("Operación cancelada");
  };

  const handlePrecioChange = (id, precio) => {
    const numericPrecio = parseFloat(precio);
    if (numericPrecio >= 0) {
      setDetalles((prevProductos) =>
        prevProductos.map((producto) =>
          producto.id === id
            ? { ...producto, precioUnitario: numericPrecio }
            : producto
        )
      );
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleCancelar} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <p className="mb-1">
              <font size="5" className="my-1">
                <b>
                  {cotizacion.estado === "Registrado"
                    ? "Precios registrados"
                    : "Cargar precios"}{" "}
                  de la cotización N°{" "}
                  {cotizacion ? cotizacion.nroCotizacion : ""}
                </b>
              </font>
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">
            <font size="4">
              <b>Proveedor: </b>
              {cotizacion ? cotizacion.proveedor.nombre : ""}
            </font>
          </p>
          <p className="mb-1">
            <font size="4">
              <b>Fecha:</b>{" "}
              {cotizacion ? formatearFecha(cotizacion.fechaEmision) : ""}
            </font>
          </p>
          <p className="mb-1">
            <font size="4">
              <b>Nro pedido compra:</b>{" "}
              {cotizacion ? cotizacion.pedidoCompra.nroPedido : ""}
            </font>
          </p>
          <Table bordered hover>
            <thead className="thead-dark">
              <tr>
                <th className="text-center">Producto</th>
                <th className="text-center">Cantidad</th>
                <th className="text-center">Precio Unitario</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((producto) => (
                <tr key={producto.id}>
                  <td className="text-center">
                    {producto.producto.descripcion}
                  </td>
                  <td className="text-center">{producto.cantidad}</td>
                  <td className="text-center col-3 px-2">
                    <input
                      type="number"
                      className="form-control"
                      inputMode="numeric"
                      value={
                        registrado
                          ? formatearNumero(producto.precioUnitario)
                          : producto.precioUnitario
                      }
                      disabled={registrado}
                      onChange={(e) =>
                        handlePrecioChange(producto.id, e.target.value)
                      }
                      min="0"
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="outline-secondary"
            onClick={() => {
              handleCancelar();
            }}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleGuardar}
            disabled={registrado}
          >
            Registrar precios
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};

export default ModalDetallesCotizacion;
