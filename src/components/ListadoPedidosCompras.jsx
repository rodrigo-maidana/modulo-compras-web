import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalPedidosDetalles from "./ModalPedidosDetalles";
import axiosInstance from "./axiosInstance";

export const ListadoPedidosCompras = () => {
  const [pedidoCompras, setPedidoCompras] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);
  const [edit, isEdit] = useState(false);

  const handleEditarPedido = (id) => {
    setSelectedPedidoId(id);
    setShow(true);
  };

  const handleShow = () => {
    setShow(true);
  };

  const handleCloseModal = () => {
    setShow(false);
    setSelectedPedidoId(null);
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

  const deletePedido = (pedido) => {
    pedido.estado = "Cancelado";
    console.log(pedido);
    axiosInstance
      .put(
        `https://api.rodrigomaidana.com:8080/pedidoscompra/${pedido.id}`,
        pedido
      )
      .then(console.log("editado"))
      .catch((error) => console.log("error al editar ", error));

    fetchCargarPedidos();
  };

  const handleSave = (updatedDetalles) => {
    // Aquí puedes manejar los detalles actualizados si es necesario
    console.log("Detalles actualizados: ", updatedDetalles);
    fetchCargarPedidos(); // Volver a cargar los pedidos si es necesario
  };

  return (
    <div className="container mx-5">
      <div className="p-1 ps-4">
        <h1>Listado de pedidos de compras</h1>
      </div>
      <div className="col-12 p-3 px-5">
        <table className="table table-secondary col-6">
          <thead>
            <tr>
              <th>Id</th>
              <th>Fecha</th>
              <th>Estado</th>
              <th>Opciones</th>
            </tr>
          </thead>
          <tbody>
            {pedidoCompras.map((pedido) => (
              <tr className="table-secondary" key={pedido.id}>
                <td>{pedido.id}</td>
                <td>{formatearFecha(pedido.fechaEmision)}</td>
                <td>{pedido.estado}</td>
                <td>
                  <button
                    className="btn btn-info m-2"
                    onClick={() => handleEditarPedido(pedido.id)}
                  >
                    Ver detalles
                  </button>
                  <input
                    className="btn btn-danger m-2"
                    type="submit"
                    onClick={() => deletePedido(pedido)}
                    value="eliminar"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="text-end">
          <button
            className="btn btn-primary"
            type="submit"
            onClick={handleShow}
          >
            Crear pedido de compra
          </button>
        </div>
      </div>
      <ModalPedidosDetalles
        id={selectedPedidoId}
        show={show}
        handleClose={handleCloseModal}
        onSave={handleSave} // Pasar la función de guardar
      />
    </div>
  );
};

export default ListadoPedidosCompras;
