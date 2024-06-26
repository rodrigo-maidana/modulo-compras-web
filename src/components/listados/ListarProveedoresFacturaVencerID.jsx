// File: ListarProveedoresFacturaVencerID.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { FaEye } from "react-icons/fa";
import { ListarFacturasAVencerID } from "./ListarFacturasAVencerID";

export const ListarProveedoresFacturaVencerID = () => {
    const [proveedores, setProveedores] = useState([]);
    const [selectedProveedorId, setSelectedProveedorId] = useState(null);

    useEffect(() => {
        axiosInstance.get("/proveedores")
            .then(response => setProveedores(response.data))
            .catch(error => console.error("Error al cargar los proveedores: ", error));
    }, []);

    const handleSelectProveedor = (id) => {
        setSelectedProveedorId(id);
    };

    if (selectedProveedorId) {
        return <ListarFacturasAVencerID proveedorId={selectedProveedorId} />;
    }

    return (
        <div className="container mt-5">
            <h2>Lista de Proveedores</h2>
            <table className="table table-bordered table-hover mt-4">
                <thead className="thead-dark">
                    <tr>
                        <th>Nombre</th>
                        <th>RUC</th>
                        <th>Contacto</th>
                        <th>Correo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {proveedores.map(proveedor => (
                        <tr key={proveedor.id}>
                            <td>{proveedor.nombre}</td>
                            <td>{proveedor.ruc}</td>
                            <td>{proveedor.contacto}</td>
                            <td>{proveedor.correo}</td>
                            <td>
                                <button className="btn btn-primary" onClick={() => handleSelectProveedor(proveedor.id)}>
                                    <FaEye /> Ver Facturas
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};
