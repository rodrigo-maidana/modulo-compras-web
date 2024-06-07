import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const FormOrdenCompra = () => {
  const [cabeceraPedido, setCabeceraPedido] = useState({});
  const [detalles, setDetalles] = useState([]);
  const [precios, setPrecios] = useState([]);
  const [detallesSeleccionados, setDetallesSeleccionados] = useState([]);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const fetchCabeceraPedido = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}`);
      setCabeceraPedido(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("Error al obtener cabecera del pedido", e);
    }
  };

  const fetchDetallePedido = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}/detalles`);
      setDetalles(response.data);
      const detallesConPrecios = response.data.map((detalle) => {
        const preciosDetalle =
          precios.find((p) => p.id === detalle.id)?.precios || [];
        const precioMinimo =
          preciosDetalle.length > 0 ? findMinPrice(preciosDetalle) : 0;
        const proveedorId =
          preciosDetalle.length > 0 ? preciosDetalle[0].proveedor.id : null;
        return {
          id: detalle.id,
          producto: detalle.producto,
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario || precioMinimo,
          proveedorId: detalle.proveedorId || proveedorId,
        };
      });
      setDetallesSeleccionados(detallesConPrecios);
      console.log(response.data);
    } catch (e) {
      console.log("Error al obtener detalle del pedido", e);
    }
  };

  const fetchPrecios = async () => {
    try {
      const response = await axiosInstance.get(`pedidos-compra/${id}/precios`);
      setPrecios(response.data);
      console.log(response.data);
    } catch (e) {
      console.log("Error al obtener precios", e);
    }
  };

  useEffect(() => {
    fetchCabeceraPedido();
    fetchPrecios();
  }, [id]);

  useEffect(() => {
    if (precios.length > 0) {
      fetchDetallePedido();
    }
  }, [precios]);

  const findMinPrice = (precios) => {
    if (precios.length === 0) return 0;
    return precios.reduce(
      (min, p) => (p.precioUnitario < min ? p.precioUnitario : min),
      precios[0].precioUnitario
    );
  };

  const handlePriceChange = (detalleId, newPrice, proveedorId) => {
    setDetallesSeleccionados((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.id === detalleId
          ? { ...detalle, precioUnitario: newPrice, proveedorId }
          : detalle
      )
    );
  };

  const handleQuantityChange = (detalleId, newQuantity) => {
    setDetallesSeleccionados((prevDetalles) =>
      prevDetalles.map((detalle) =>
        detalle.id === detalleId
          ? { ...detalle, cantidad: newQuantity }
          : detalle
      )
    );
  };

  const handleGenerarOrden = async () => {
    try {
      const cabeceraPreviewResponse = await axiosInstance.get(
        "ordenes-compra/preview"
      );
      const cabeceraPreview = cabeceraPreviewResponse.data;

      const ordenesCompra = detallesSeleccionados.reduce((acc, detalle) => {
        const proveedorId = detalle.proveedorId;
        if (!proveedorId) {
          throw new Error(
            `Proveedor ID is undefined for detalle ${detalle.id}`
          );
        }
        if (!acc[proveedorId]) {
          const proveedor = precios
            .find((p) =>
              p.precios.some((precio) => precio.proveedor.id === proveedorId)
            )
            ?.precios.find(
              (precio) => precio.proveedor.id === proveedorId
            )?.proveedor;
          if (!proveedor) {
            throw new Error(
              `Proveedor not found for proveedorId ${proveedorId}`
            );
          }
          acc[proveedorId] = {
            proveedor,
            fechaEmision: cabeceraPreview.fechaEmision,
            estado: cabeceraPreview.estado,
            nroOrdenCompra: cabeceraPreview.nroOrdenCompra,
            detalles: [],
          };
        }
        acc[proveedorId].detalles.push({
          cantidad: detalle.cantidad,
          precioUnitario: detalle.precioUnitario,
          producto: detalle.producto,
        });
        return acc;
      }, {});

      for (const [proveedorId, orden] of Object.entries(ordenesCompra)) {
        const postCabeceraResponse = await axiosInstance.post(
          "ordenes-compra",
          {
            proveedor: orden.proveedor,
            fechaEmision: orden.fechaEmision,
            estado: orden.estado,
            nroOrdenCompra: orden.nroOrdenCompra,
          }
        );
        const cabeceraId = postCabeceraResponse.data.id;

        const detallesPromises = orden.detalles.map((detalle) => {
          return axiosInstance.post(`ordenes-detalles/${cabeceraId}`, detalle);
        });

        await Promise.all(detallesPromises);
      }

      toast.success("Orden de compra generada exitosamente");
      setTimeout(() => {
        navigate("/orden-compra");
      }, 3000); // 3 segundos de retraso antes de redirigir
    } catch (e) {
      console.log("Error al generar pedido", e);
      toast.error("Error al generar la orden de compra");
    }
  };

  const calcularTotal = () => {
    return detallesSeleccionados.reduce(
      (total, detalle) => total + detalle.cantidad * detalle.precioUnitario,
      0
    );
  };

  return (
    <>
      <div className="container">
        <div className="cabecera">
          <h2 className="my-4">Orden de Compra</h2>
          <h3 className="mb-4">Pedido: {cabeceraPedido.nroPedido}</h3>
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
                const detalleSeleccionado =
                  detallesSeleccionados.find((d) => d.id === detalle.id) || {};
                const precioActual =
                  detalleSeleccionado.precioUnitario || precioMinimo;
                const cantidadActual =
                  detalleSeleccionado.cantidad || detalle.cantidad;

                return (
                  <tr className="table-light" key={detalle.id}>
                    <td>{detalle.producto.descripcion}</td>
                    <td>
                      <input
                        type="number"
                        min="0"
                        className="form-control"
                        value={cantidadActual}
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
                        onChange={(e) => {
                          const selectedPrice = parseFloat(e.target.value);
                          const proveedorId = productoPrecios.find(
                            (precio) => precio.precioUnitario === selectedPrice
                          )?.proveedor.id;
                          handlePriceChange(
                            detalle.id,
                            selectedPrice,
                            proveedorId
                          );
                        }}
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
                      {formatearNumero(cantidadActual * precioActual)} Gs
                    </td>
                  </tr>
                );
              })}
              <tr>
                <td colSpan="3" className="text-end">
                  <strong>Total</strong>
                </td>
                <td className="text-end">
                  <strong>{formatearNumero(calcularTotal())} Gs</strong>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="text-end">
          <button className="btn btn-primary" onClick={handleGenerarOrden}>
            Generar orden
          </button>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};
