import React, { useEffect, useState } from "react";
import axios from "axios";
import ModalPedidosDetalles from "./ModalPedidosDetalles";

export const ListadoPedidosCompras = () => {
  const [pedidoCompras, setPedidoCompras] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoId, setSelectedPedidoId] = useState(null);

  const handleOpenModal = (id) => {
    setSelectedPedidoId(id);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedPedidoId(null);
  };
  const fetchCargarPedidos = () => {
    axios
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
    // Crear un objeto Date a partir de la fecha de emisión
    const fechaEmision = new Date(fecha);
    // Obtener los componentes de la fecha (año, mes y día)
    const año = fechaEmision.getFullYear();
    const mes = fechaEmision.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
    const dia = fechaEmision.getDate();
    // Formatear la fecha en el formato deseado
    return `${año}-${dia < 10 ? "0" + dia : dia}-${mes < 10 ? "0" + mes : mes}`;
  };

  const deletePedido = (pedido) => {
    pedido.estado = "Cancelado";
    console.log(pedido);
    axios
      .put(
        `https://api.rodrigomaidana.com:8080/pedidoscompra/${pedido.id}`,
        pedido
      )
      .then(console.log("editado"))
      .catch((error) => console.log("error al editar ", error));

    fetchCargarPedidos();
  };
  return (
    <div className="containter">
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
                    onClick={() => handleOpenModal(pedido.id)}
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
      </div>
      <ModalPedidosDetalles
        id={selectedPedidoId}
        show={showModal}
        onHide={handleCloseModal}
      />
    </div>
  );
};
