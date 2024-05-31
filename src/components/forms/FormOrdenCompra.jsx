import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axiosInstance from "../axiosInstance";

export const FormOrdenCompra = () => {
  const [cabeceraPedido, setCabeceraPedido] = useState({});
  const [detalles, setDetalles] = useState([]);
  const [precios, setPrecios] = useState([]);
  const { id } = useParams();

  // Obtener cabecera del pedido de compra
  const fetchCabeceraPedido = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}`);
      setCabeceraPedido(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("error al obtener cabecera del pedido", e);
    }
  };

  // Obtener detalle del pedido de compra
  const fetchDetallePedido = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}/detalles`);
      setDetalles(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("error al obtener detalle del pedido", e);
    }
  };

  // Obtener precios del pedido de compra
  const fetchPrecios = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}/precios`);
      setPrecios(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("error al obtener precios", e);
    }
  };

  useEffect(() => {
    fetchCabeceraPedido();
    fetchDetallePedido();
    fetchPrecios();
  }, [id]);

  // Función para encontrar el precio mínimo
  const findMinPrice = (precios) => {
    if (precios.length === 0) return 0;
    return precios.reduce(
      (min, p) => (p.precioUnitario < min ? p.precioUnitario : min),
      precios[0].precioUnitario
    );
  };

  // Manejar cambios en el precio seleccionado
  const handlePriceChange = (detalleId, newPrice) => {
    setDetalles((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.id === detalleId
          ? { ...detalle, precioUnitario: newPrice }
          : detalle
      )
    );
  };

  // Manejar cambios en la cantidad
  const handleQuantityChange = (detalleId, newQuantity) => {
    setDetalles((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.id === detalleId
          ? { ...detalle, cantidad: newQuantity }
          : detalle
      )
    );
  };

  return (
    <>
      <div className="container">
        <div className="cabecera">
          <h2>Orden de Compra</h2>
          <h3 className="text-end">Pedido: {cabeceraPedido.nroPedido}</h3>
        </div>
        <div>
          <table className="table table-bordered table-light">
            <thead>
              <tr className="table-light text-center">
                <th className="col-2">Producto</th>
                <th className="col-1">Cantidad</th>
                <th className="col-4">Precio Unitario</th>
                <th className="col-1">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detalles.map((detalle) => {
                const productoPrecios =
                  precios.find((p) => p.id === detalle.id)?.precios || [];
                const precioMinimo = findMinPrice(productoPrecios);
                const precioActual = detalle.precioUnitario || precioMinimo;

                return (
                  <tr className="table-light" key={detalle.id}>
                    <td>{detalle.producto.descripcion}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={detalle.cantidad}
                        onChange={(e) =>
                          handleQuantityChange(
                            detalle.id,
                            parseInt(e.target.value, 10)
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        className="form-select"
                        value={precioActual}
                        onChange={(e) =>
                          handlePriceChange(
                            detalle.id,
                            parseFloat(e.target.value)
                          )
                        }
                      >
                        {productoPrecios.map((precio, index) => (
                          <option key={index} value={precio.precioUnitario}>
                            {precio.proveedor.nombre} - {precio.precioUnitario}{" "}
                            Gs
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="text-end">
                      {detalle.cantidad * precioActual} Gs
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
