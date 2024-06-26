import React, { useState, useEffect } from "react";
import { Modal, Button } from "react-bootstrap";
import axiosInstance from "../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";

export const ModalFacturaOrdenCompra = ({
  show,
  handleClose,
  idOrdenCompra,
  onSave,
}) => {
  const [nombre, setNombre] = useState("");
  const [direccion, setDireccion] = useState("");
  const [fechaEmision, setFechaEmision] = useState("");
  const [fechaVencimiento, setFechaVencimiento] = useState("");
  const [numeroFactura, setNumeroFactura] = useState("");
  const [timbrado, setTimbrado] = useState("");
  const [condicion, setCondicion] = useState("");
  const [deposito, setDeposito] = useState("");
  const [productos, setProductos] = useState([]);
  const [depositos, setDepositos] = useState([]);

  useEffect(() => {
    if (idOrdenCompra) {
      // Cargar datos de la orden de compra y productos
      axiosInstance
        .get(`/ordenes-compra/${idOrdenCompra}`)
        .then((response) => {
          const ordenCompra = response.data;
          setNombre(ordenCompra.proveedor.nombre);
          setDireccion(ordenCompra.proveedor.direccion);
        })
        .catch((error) => {
          toast.error("Error al cargar los datos de la factura");
          console.error("Error al cargar los datos de la factura:", error);
        });

      axiosInstance
        .get(`/ordenes-compra/${idOrdenCompra}/detalles`)
        .then((response) => {
          setProductos(response.data);
        })
        .catch((error) => {
          toast.error("Error al cargar los productos de la orden de compra");
          console.error(
            "Error al cargar los productos de la orden de compra:",
            error
          );
        });
    }

    // Cargar la lista de depósitos
    axiosInstance
      .get("/depositos")
      .then((response) => {
        setDepositos(response.data);
      })
      .catch((error) => {
        toast.error("Error al cargar los depósitos");
        console.error("Error al cargar los depósitos:", error);
      });
  }, [idOrdenCompra]);

  const handleGuardar = async () => {
    // Validar número de factura
    const facturaRegex = /^\d{3}-\d{3}-\d{7}$/;
    if (!facturaRegex.test(numeroFactura)) {
      toast.error(
        "Formato de número de factura incorrecto. Ej: 001-001-0000001"
      );
      return;
    }

    // Validar timbrado
    const timbradoRegex = /^\d+$/;
    if (!timbradoRegex.test(timbrado)) {
      toast.error("Formato de timbrado incorrecto. Solo se permiten números.");
      return;
    }

    // Validar que todos los campos estén completos
    if (
      !fechaEmision ||
      !fechaVencimiento ||
      !numeroFactura ||
      !timbrado ||
      !condicion ||
      !deposito
    ) {
      toast.error("Todos los campos son obligatorios");
      return;
    }

    const factura = {
      idOrdenCompra,
      idDeposito: parseInt(deposito), // Asegurarnos de que sea un número
      fechaEmision,
      fechaVencimiento,
      nroFactura: numeroFactura,
      timbrado,
      condicion,
    };

    console.log("Enviando factura:", JSON.stringify(factura, null, 2)); // Mensaje de depuración

    try {
      const response = await axiosInstance.post("/facturas", factura);
      const facturaId = response.data.id; // Obtener el ID de la factura
      console.log("Factura guardada con ID:", facturaId);

      // Crear promesas para guardar los productos uno a uno
      for (const producto of productos) {
        const detalleFactura = {
          producto: {
            id: producto.producto.id,
            descripcion: producto.producto.descripcion,
            marca: {
              id: producto.producto.marca.id,
              nombre: producto.producto.marca.nombre,
            },
            categoria: {
              id: producto.producto.categoria.id,
              nombre: producto.producto.categoria.nombre,
            },
          },
          cantidad: producto.cantidad,
          precioUnitario: producto.precioUnitario,
        };

        console.log(
          "Enviando producto:",
          JSON.stringify(detalleFactura, null, 2)
        ); // Mensaje de depuración

        await axiosInstance.post(
          `/facturas-detalles/${facturaId}`,
          detalleFactura
        );
      }

      toast.success("Factura y productos guardados correctamente");
      onSave();
      handleClose();
    } catch (error) {
      toast.error("Error al guardar la factura o los productos");
      console.error(
        "Error al guardar la factura o los productos:",
        error.response?.data || error.message
      );
    }
  };

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const handleFechaVencimientoChange = (e) => {
    const fechaVenc = e.target.value;
    if (fechaVenc < fechaEmision) {
      toast.error(
        "La fecha de vencimiento no puede ser anterior a la fecha de emisión"
      );
      setFechaVencimiento("");
    } else {
      setFechaVencimiento(fechaVenc);
    }
  };

  const handleNumeroFacturaChange = (e) => {
    const value = e.target.value;
    setNumeroFactura(value);
  };

  const handleTimbradoChange = (e) => {
    const value = e.target.value;
    setTimbrado(value);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Detalles de la Factura</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label>Nombre/Razón Social</label>
            <input
              type="text"
              className="form-control"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Dirección</label>
            <input
              type="text"
              className="form-control"
              value={direccion}
              onChange={(e) => setDireccion(e.target.value)}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Fecha de Emisión</label>
            <input
              type="date"
              className="form-control"
              value={fechaEmision}
              onChange={(e) => setFechaEmision(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label>Fecha de Vencimiento</label>
            <input
              type="date"
              className="form-control"
              value={fechaVencimiento}
              onChange={handleFechaVencimientoChange}
            />
          </div>
          <div className="form-group">
            <label>Número de Factura</label>
            <input
              type="text"
              className="form-control"
              value={numeroFactura}
              onChange={handleNumeroFacturaChange}
              placeholder="001-001-000001"
            />
          </div>
          <div className="form-group">
            <label>Timbrado</label>
            <input
              type="text"
              className="form-control"
              value={timbrado}
              onChange={handleTimbradoChange}
              placeholder="16.569.724"
            />
          </div>
          <div className="form-group">
            <label>Condición</label>
            <select
              className="form-control"
              value={condicion}
              onChange={(e) => setCondicion(e.target.value)}
            >
              <option value="">Seleccione una opción</option>
              <option value="Contado">Contado</option>
              <option value="Credito">Crédito</option>
            </select>
          </div>
          <div className="form-group">
            <label>Deposito</label>
            <select
              className="form-control"
              value={deposito}
              onChange={(e) => setDeposito(e.target.value)}
            >
              <option value="">Seleccione un depósito</option>
              {depositos.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.nombre}
                </option>
              ))}
            </select>
          </div>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>Cant.</th>
                <th>Clase de Mercaderías y/o Servicios</th>
                <th>Precio Unitario</th>
                <th>Valor Parcial</th>
              </tr>
            </thead>
            <tbody>
              {productos.map((producto, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={producto.cantidad}
                      onChange={(e) => {
                        const newProductos = [...productos];
                        newProductos[index].cantidad = e.target.value;
                        setProductos(newProductos);
                      }}
                    />
                  </td>
                  <td>
                    {producto.producto.descripcion}
                    {/**
                    <input
                      type="text"
                      className="form-control"
                      value={producto.producto.descripcion}
                      onChange={(e) => {
                        const newProductos = [...productos];
                        newProductos[index].producto.descripcion =
                          e.target.value;
                        setProductos(newProductos);
                      }}
                    />
                     */}
                  </td>
                  <td>
                    <input
                      type="number"
                      className="form-control"
                      value={producto.precioUnitario}
                      onChange={(e) => {
                        const newProductos = [...productos];
                        newProductos[index].precioUnitario = e.target.value;
                        setProductos(newProductos);
                      }}
                    />
                  </td>
                  <td>
                    {formatearNumero(
                      producto.precioUnitario * producto.cantidad
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="form-group">
            <label>Total IVA</label>
            <input
              type="text"
              className="form-control"
              value={formatearNumero(
                (
                  productos.reduce(
                    (acc, prod) => acc + prod.precioUnitario * prod.cantidad,
                    0
                  ) / 11
                ).toFixed(0)
              )}
              readOnly
            />
          </div>
          <div className="form-group">
            <label>Total</label>
            <input
              type="text"
              className="form-control"
              value={formatearNumero(
                productos
                  .reduce(
                    (acc, prod) => acc + prod.precioUnitario * prod.cantidad,
                    0
                  )
                  .toFixed(0)
              )}
              readOnly
            />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleGuardar}>
            Guardar Factura
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </>
  );
};
