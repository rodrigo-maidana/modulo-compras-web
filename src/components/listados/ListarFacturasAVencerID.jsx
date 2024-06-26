// File: ListarFacturasAVencerID.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { TablaFacturasAVencerID } from "../tablas/TablaFacturasAVencerID";

export const ListarFacturasAVencerID = ({ proveedorId }) => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFacturas = () => {
        setLoading(true);
        axiosInstance
            .get(`/reportes/facturas-vencimiento-mes-actual/${proveedorId}`)
            .then((response) => {
                setFacturas(response.data);
                setLoading(false);
            })
            .catch((error) => {
                setLoading(false);
                setError(error);
                if (error.response && error.response.status === 403) {
                    console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para acceder a este recurso.");
                } else {
                    console.error("Error: ", error);
                }
            });
    };

    useEffect(() => {
        fetchFacturas();
    }, [proveedorId]);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar las facturas.</div>;
    }

    return (
        <TablaFacturasAVencerID
            facturas={facturas}
        />
    );
};
