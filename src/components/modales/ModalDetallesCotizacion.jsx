import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Table from "react-bootstrap/Table";
import axios from "axios";

const ModalDetallesCotizacion = ({ cotizacion, show, handleClose, onSave }) => {
  const [detalles, setDetalles] = useState([]);
  //cargar detalles del pedido de cotizacion
  const fetchProductos = async () => {
    try {
      const response = await axios.get(
        `http://localhost:3000/pedidos-cotizacion/detalles/${cotizacion.id}`
      );
      const productosConPrecio = response.data.productos.map((producto) => ({
        ...producto,
        precioUnitario: producto.precioUnitario || 0, //iniciar el precio en 0 por las dudas
      }));
      setDetalles(productosConPrecio);
    } catch (error) {
      console.error("Error al cargar los productos:", error);
    }
  };

  useEffect(() => {
    if (show) {
      fetchProductos();
    }
  }, [show]);

  const handleGuardar = () => {
    const allPriceSet = detalles.every(
      (producto) => producto.precioUnitario > 0
    );

    //si todos los precios son mayor a 0
    if (allPriceSet) {
      // hacer put de los productos con sus precios cargados y el estado a cotizado
      try {
        axios.put(
          `http://localhost:3000/pedidos-cotizacion/detalles/${cotizacion.id}`,
          { productos: detalles, estado: "Cotizado" }
        );

        onSave();
      } catch (error) {
        console.log("error al put de los precios de los productos", error);
      }
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
            Detalles de la Cotización N°{cotizacion.nroPedidoCotizacion}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
          <Button variant="primary" onClick={handleGuardar}>
            Registrar precios
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ModalDetallesCotizacion;
