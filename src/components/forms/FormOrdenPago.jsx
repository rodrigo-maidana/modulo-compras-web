import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../axiosInstance";
import Select from "react-select";

export const FormOrdenPago = () => {
  const [factura, setFactura] = useState({});
  const [metodosPago, setMetodosPago] = useState([]);
  const [selectedMetodo, setSelectedMetodo] = useState(null);
  const [monto, setMonto] = useState("");
  const [pagos, setPagos] = useState([]);
  const [previewData, setPreviewData] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };
  const fetchFactura = async () => {
    try {
      const response = await axiosInstance.get(`facturas/${id}`);
      setFactura(response.data);
    } catch (e) {
      console.log("Error al obtener factura", e);
    }
  };

  const fetchMetodosPago = async () => {
    try {
      const response = await axiosInstance.get("metodos-pago");
      const opciones = response.data.map((metodo) => ({
        value: metodo.id,
        label: metodo.nombre,
      }));
      setMetodosPago(opciones);
    } catch (e) {
      console.log("Error al obtener métodos de pago", e);
    }
  };

  const fetchPreviewData = async () => {
    try {
      const response = await axiosInstance.get("orden-pago/preview");
      setPreviewData(response.data);
    } catch (e) {
      console.log("Error al obtener datos de preview", e);
    }
  };

  useEffect(() => {
    fetchFactura();
    fetchMetodosPago();
    fetchPreviewData();
  }, [id]);

  const handleMontoChange = (e) => {
    const { value } = e.target;
    if (/^\d*\.?\d*$/.test(value)) {
      setMonto(value);
    }
  };

  const agregarPago = () => {
    const montoNum = parseFloat(monto);
    const totalPagado = pagos.reduce((acc, pago) => acc + pago.monto, 0);

    if (selectedMetodo && montoNum && montoNum <= factura.saldoPendiente) {
      setPagos([...pagos, { metodo: selectedMetodo, monto: montoNum }]);
      setMonto("");
      setSelectedMetodo(null);
      actualizarSaldoPendiente(totalPagado + montoNum);
    } else {
      console.log(totalPagado + montoNum <= factura.saldoPendiente);
      console.log("a pagar: ", totalPagado + montoNum);
      console.log("saldo pendiente: ", factura.saldoPendiente);
      alert(
        "Seleccione un método de pago y asegúrese de que el monto es válido y no excede el saldo pendiente."
      );
    }
  };

  const actualizarSaldoPendiente = (totalPagado) => {
    setFactura((prevFactura) => ({
      ...prevFactura,
      saldoPendiente: prevFactura.montoTotal - totalPagado,
    }));
  };

  const calcularTotal = () => {
    return pagos.reduce((acc, pago) => acc + pago.monto, 0);
  };

  const confirmarPago = async () => {
    try {
      const totalPagado = calcularTotal();
      const ordenPago = {
        factura: factura,
        proveedor: factura.proveedor,
        fechaPago: previewData.fechaPago,
        nroOrdenPago: previewData.nroOrdenPago,
        estado: "Pendiente",
        montoTotal: parseFloat(totalPagado),
      };
      const cabeceraResponse = await axiosInstance.post(
        `orden-pago/${factura.id}`,
        ordenPago
      );
      const cabeceraId = cabeceraResponse.data.id;

      const detallesPagos = pagos.map((pago) => ({
        idMetodoPago: pago.metodo.value,
        monto: pago.monto,
      }));
      console.log(detallesPagos);
      await axiosInstance.post(
        `ordenes-pago-detalles/${cabeceraId}/bulk`,
        detallesPagos
      );

      alert("Orden de pago confirmada exitosamente");
      navigate("/facturas");
    } catch (e) {
      console.log("Error al confirmar pago", e);
      alert("Error al confirmar el pago");
    }
  };

  return (
    <div className="container">
      <h2 className="pt-3">Orden de pago</h2>
      <div
        className="cabecera my-3 p-4"
        style={{ border: "1px solid black", borderRadius: "10px" }}
      >
        <h3>
          Proveedor: {factura.proveedor?.nombre ? factura.proveedor.nombre : ""}
        </h3>
        <h5>Factura nro: {factura.nroFactura}</h5>
        <h5>
          Monto total:{" "}
          {factura.montoTotal ? formatearNumero(factura.montoTotal) : ""}
        </h5>
        <h5>
          Saldo pendiente:{" "}
          {factura.saldoPendiente
            ? formatearNumero(factura.saldoPendiente)
            : ""}
        </h5>
      </div>
      <div
        className="metodosPago my-4 p-4"
        style={{ border: "1px solid black", borderRadius: "10px" }}
      >
        <h5>Método de Pago</h5>
        <div className="col-4 my-1">
          <Select
            options={metodosPago}
            value={selectedMetodo}
            onChange={setSelectedMetodo}
          />
        </div>
        <div className="col-4">
          <h5 className="mt-3">Monto</h5>
          <input
            type="text"
            className="form-control"
            value={monto}
            onChange={handleMontoChange}
          />
        </div>
        <button
          className="btn btn-secondary ms-5 me-2 mt-3"
          onClick={() => {
            setMonto("");
            setSelectedMetodo(null);
          }}
        >
          Cancelar
        </button>
        <button className="btn btn-primary mt-3" onClick={agregarPago}>
          Agregar Método de Pago
        </button>
      </div>
      <div className="mt-3 col-5">
        <h4>Métodos de Pago Agregados</h4>
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Método de Pago</th>
              <th>Monto</th>
            </tr>
          </thead>
          <tbody>
            {pagos.map((pago, index) => (
              <tr key={index}>
                <td>{pago.metodo.label}</td>
                <td>{formatearNumero(pago.monto)}</td>
              </tr>
            ))}
            <tr>
              <td>
                <strong>Total</strong>
              </td>
              <td>
                <strong>{formatearNumero(calcularTotal())}</strong>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="col-5 text-end ">
        <button
          className="btn btn-secondary mx-2"
          onClick={() => {
            window.location.href = "/facturas";
          }}
        >
          Cancelar
        </button>
        <button className="btn btn-success" onClick={confirmarPago}>
          Confirmar Pago
        </button>
      </div>
    </div>
  );
};
