// File: ListarFacturasAVencer.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { TablaFacturasAVencer } from "../tablas/TablaFacturasAVencer";

export const ListarFacturasAVencer = () => {
    const [facturas, setFacturas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchFacturas = () => {
        setLoading(true);
        axiosInstance
            .get("/reportes/facturas-vencimiento-mes-actual")
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
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar las facturas.</div>;
    }

    return (
        <TablaFacturasAVencer
            facturas={facturas}
        />
    );
};
