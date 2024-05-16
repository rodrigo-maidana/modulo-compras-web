import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import axios from "axios";
import { ProductTableReal } from "./ProductTableReal";

const ModalPedidosDetalles = ({ id, show, handleClose, onSave }) => {
  const [detalles, setDetalles] = useState([]);
  const [productosAgregados, setProductosAgregados] = useState([]);
  const [editandoProducto, setEditandoProducto] = useState(null);
  const [nuevaCantidad, setNuevaCantidad] = useState(0);

  const handleAgregarProducto = (producto, cantidad) => {
    const productoConCantidad = { ...producto, cantidad };
    setProductosAgregados([...productosAgregados, productoConCantidad]);
  };

  const handleEditarCantidad = (producto) => {
    setEditandoProducto(producto);
    setNuevaCantidad(producto.cantidad);
  };

  const handleGuardarCantidad = () => {
    setDetalles((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.producto.id === editandoProducto.id
          ? {
              ...detalle,
              producto: { ...detalle.producto, cantidad: nuevaCantidad },
            }
          : detalle
      )
    );
    setEditandoProducto(null);
  };

  const handleCancelarEdicion = () => {
    setEditandoProducto(null);
  };

  const handleEliminarProducto = (idProducto) => {
    setDetalles((prevDetalles) =>
      prevDetalles.filter((detalle) => detalle.producto.id !== idProducto)
    );
  };

  useEffect(() => {
    const fetchDetalles = async () => {
      try {
        const response = await axios.get(
          `https://api.rodrigomaidana.com:8080/pedidoscompra/detalles/${id}`
        );
        setDetalles(response.data);
      } catch (error) {
        console.error("Error al cargar los detalles del pedido:", error);
      }
    };

    if (id) {
      fetchDetalles();
    }
  }, [id]);

  const handleSave = () => {
    onSave(detalles);
    handleClose();
  };

  console.log("pedido que llego: ", detalles);

  return (
    <Modal show={show} onHide={handleClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Detalles del Pedido N°{id}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {id ? null : (
          <ProductTableReal
            handleAgregarProducto={handleAgregarProducto}
            handleEditarCantidad={handleEditarCantidad}
            handleEliminarProducto={handleEliminarProducto}
          />
        )}
        <div>Listado de detalles</div>
        <table className="table table-dark table-striped table-bordered">
          <thead>
            <tr>
              <th>ID</th>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Cantidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {id
              ? detalles.map((item) => (
                  <tr key={item.producto.id}>
                    <td>{item.producto.id}</td>
                    <td>{item.producto.descripcion}</td>
                    <td>{item.producto.categoria.nombre}</td>
                    <td>
                      {editandoProducto === item.producto ? (
                        <>
                          <input
                            className="col-3 me-2"
                            type="number"
                            value={nuevaCantidad}
                            onChange={(e) => setNuevaCantidad(e.target.value)}
                          />
                          <Button
                            variant="primary"
                            onClick={handleGuardarCantidad}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={handleCancelarEdicion}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>{item.producto.cantidad}</>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarProducto(item.producto.id)}
                      >
                        Eliminar
                      </Button>{" "}
                      <Button
                        variant="primary"
                        onClick={() => handleEditarCantidad(item.producto)}
                      >
                        Modificar
                      </Button>
                    </td>
                  </tr>
                ))
              : productosAgregados.map((producto) => (
                  <tr key={producto.id}>
                    <td>{producto.id}</td>
                    <td>{producto.descripcion}</td>
                    <td>{producto.categoria.nombre}</td>
                    <td>
                      {editandoProducto === producto ? (
                        <>
                          <input
                            className="col-3 me-2"
                            type="number"
                            value={nuevaCantidad}
                            onChange={(e) => setNuevaCantidad(e.target.value)}
                          />
                          <Button
                            variant="primary"
                            onClick={handleGuardarCantidad}
                          >
                            Guardar
                          </Button>
                          <Button
                            variant="danger"
                            onClick={handleCancelarEdicion}
                          >
                            Cancelar
                          </Button>
                        </>
                      ) : (
                        <>{producto.cantidad}</>
                      )}
                    </td>
                    <td>
                      <Button
                        variant="danger"
                        onClick={() => handleEliminarProducto(producto.id)}
                      >
                        Eliminar
                      </Button>{" "}
                      <Button
                        variant="primary"
                        onClick={() => handleEditarCantidad(producto)}
                      >
                        Modificar
                      </Button>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-danger" onClick={handleClose}>
          Cancelar
        </button>
        <button className="btn btn-primary" onClick={handleSave}>
          Confirmar pedido
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ModalPedidosDetalles;
