import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axiosInstance from "../axiosInstance";
const ModalDetallesCotizacion = ({
  cotizacion,
  show,
  handleClose,
  onSave,
  formatearFecha,
}) => {
  const [detalles, setDetalles] = useState([]);
  const [registrado, setRegistrado] = useState(false);
  //cargar detalles del pedido de cotizacion
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
      console.log(registrado);
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
    //si todos los precios son mayor a 0
    if (allPriceSet) {
      // hacer put de los productos con sus precios cargados y el estado a cotizado
      const preciosPromises = detalles.map(async (detalle) => {
        try {
          await axiosInstance.put(`cotizacion-detalles/${detalle.id}`, detalle);
          onSave();
        } catch (error) {
          console.log("error put de los precios de los productos", error);
        }
      });
      await Promise.all(preciosPromises);
      cotizacion.estado = "Registrado";
      axiosInstance.put(`cotizaciones/${cotizacion.id}`, cotizacion);
    } else {
      alert("todos los productos deben tener precio mayor a 0");
    }
  };

  const handleCancelar = () => {
    handleClose();
    setDetalles([]);
  };
  //funcion para que el usuario pueda modificar el precio de los productos de la cotizacion mayor a 0
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
                {cotizacion.estado === "Registrado"
                  ? "Precios registrados"
                  : "Cargar precios"}{" "}
                de la cotización N° {cotizacion ? cotizacion.nroCotizacion : ""}
              </font>
            </p>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p className="mb-1">
            <font size="4">
              Proveedor: {cotizacion ? cotizacion.proveedor.nombre : ""}
            </font>
          </p>
          <p className="mb-1">
            <font size="4">
              fecha: {cotizacion ? formatearFecha(cotizacion.fechaEmision) : ""}
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
                      value={producto.precioUnitario}
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
          <Button variant="outline-secondary" onClick={handleCancelar}>
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
    </>
  );
};

export default ModalDetallesCotizacion;
