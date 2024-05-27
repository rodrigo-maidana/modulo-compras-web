import React, { useState, useEffect } from "react";
import { Modal, Button, Table, Spinner, Alert } from "react-bootstrap";
import axiosInstance from "../../axiosInstance";

const ModalProveedoresCotizacion = ({ show, handleClose, selectedCategoria }) => {
    const [proveedores, setProveedores] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (selectedCategoria) {
            const fetchProveedores = async () => {
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


    return (
        <Modal show={show} onHide={handleClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Proveedores para la categoría: {selectedCategoria ? selectedCategoria.nombre : 'N/A'}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading && <Spinner animation="border" />}
                {error && <Alert variant="danger">{error}</Alert>}
                {!loading && !error && (
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Nombre</th>
                                <th>RUC</th>
                                <th>Contacto</th>
                                <th>Correo</th>
                                <th>Dirección</th>
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
                                        <td>{proveedor.correo}</td>
                                        <td>{proveedor.direccion}</td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="text-center">No hay proveedores disponibles</td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Cerrar</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ModalProveedoresCotizacion;
