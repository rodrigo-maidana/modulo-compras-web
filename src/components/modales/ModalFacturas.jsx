// src/modales/ModalFacturas.jsx

import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "react-bootstrap";
import axiosInstance from "../axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";

const ModalFacturas = ({ show, handleClose, id }) => {
    const [factura, setFactura] = useState(null);
    const [productos, setProductos] = useState([]);

    useEffect(() => {
        if (id) {
            // Cargar datos de la factura
            axiosInstance.get(`/facturas/${id}`)
                .then(response => {
                    setFactura(response.data);
                })
                .catch(error => {
                    toast.error("Error al cargar los datos de la factura");
                    console.error("Error al cargar los datos de la factura:", error);
                });

            // Cargar productos de la factura
            axiosInstance.get(`/facturas/${id}/detalles`)
                .then(response => {
                    setProductos(response.data);
                })
                .catch(error => {
                    toast.error("Error al cargar los productos de la factura");
                    console.error("Error al cargar los productos de la factura:", error);
                });
        }
    }, [id]);

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Detalle de Factura</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {factura && (
                    <>
                        <p><strong>RUC:</strong> {factura.proveedor.ruc}</p>
                        <p><strong>Timbrado:</strong> {factura.timbrado}</p>
                        <p><strong>Fecha Emisión:</strong> {formatearFecha(factura.fechaEmision)}</p>
                        <p><strong>Fecha Vencimiento:</strong> {formatearFecha(factura.fechaVencimiento)}</p>
                        <p><strong>Depósito:</strong> {factura.deposito.nombre}</p>

                        <h5>Productos</h5>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>Nombre</th>
                                    <th>Cantidad</th>
                                    <th>Precio Unitario</th>
                                    <th>Valor Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {productos.map((producto) => (
                                    <tr key={producto.id}>
                                        <td>{producto.producto.descripcion}</td>
                                        <td>{producto.cantidad}</td>
                                        <td>{producto.precioUnitario.toFixed(2)}</td>
                                        <td>{(producto.precioUnitario * producto.cantidad).toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>

                        <p><strong>Valor Total:</strong> {factura.montoTotal.toFixed(2)}</p>
                        <p><strong>IVA Total:</strong> {(factura.montoTotal / 11).toFixed(2)}</p>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>
    );
};

export default ModalFacturas;
