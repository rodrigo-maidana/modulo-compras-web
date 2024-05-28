import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../axiosInstance";

const ModalProveedoresCotizacion = ({ show, handleClose, selectedCategoria, pedidoCompra }) => {
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedores, setSelectedProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedCategoria) {
            const fetchProveedores = async () => {

                setLoading(true);
                try {
                    const response = await axiosInstance.get(`/categorias/${selectedCategoria.id}/proveedores`);
                    setProveedores(response.data);
                } catch (error) {
                    console.error("Error al cargar los proveedores:", error);
                    setError("Error al cargar los proveedores");
                    setProveedores([]);
                } finally {
                    setLoading(false);
                }
            };

            fetchProveedores();
        }
    }, [selectedCategoria]);

    const handleCheckboxChange = (proveedorId) => {
        setSelectedProveedores((prevSelected) => {
            if (prevSelected.includes(proveedorId)) {
                return prevSelected.filter((id) => id !== proveedorId);
            } else {
                return [...prevSelected, proveedorId];
            }
        });
    };

    const handleConfirm = async () => {
        try {
            for (const proveedorId of selectedProveedores) {
                const proveedor = proveedores.find((prov) => prov.id === proveedorId);
                const cotizacion = {
                    idPedidoCompra: pedidoCompra.id,
                    idProveedor: proveedor.id
                };
                console.log("Enviando cotización:", cotizacion);
                await axiosInstance.post('/cotizaciones', cotizacion);
            }
            handleClose();
        } catch (error) {
            console.error('Error al crear cotizaciones:', error);
            alert('Error al crear cotizaciones');
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Proveedores para la categoría: {selectedCategoria ? selectedCategoria.nombre : 'N/A'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {!loading && !error && (
                    <>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Nombre</th>
                                    <th>RUC</th>
                                    <th>Contacto</th>
                                    <th>Seleccionar</th>
                                </tr>
                            </thead>
                            <tbody>
                                {proveedores.length > 0 ? (
                                    proveedores.map((proveedor, index) => (
                                        <tr key={proveedor.id}>
                                            <td>{index + 1}</td>
                                            <td>{proveedor.nombre}</td>
                                            <td>{proveedor.ruc}</td>
                                            <td>{proveedor.contacto}</td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={selectedProveedores.includes(proveedor.id)}
                                                    onChange={() => handleCheckboxChange(proveedor.id)}
                                                />
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center">No hay proveedores disponibles</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>
                    </>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
                <Button
                    variant="primary"
                    onClick={handleConfirm}
                >
                    Confirmar
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalProveedoresCotizacion;
