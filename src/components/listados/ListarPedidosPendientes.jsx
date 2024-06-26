// File: ListarPedidosPendientes.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { TablaPedidosPendientes } from "../tablas/TablaPedidosPendientes";

export const ListarPedidosPendientes = () => {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchPedidosPendientes = () => {
        setLoading(true);
        axiosInstance
            .get("/reportes/pedidos-compra-pendientes")
            .then((response) => {
                setPedidos(response.data);
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
        fetchPedidosPendientes();
    }, []);

    if (loading) {
        return <div>Cargando...</div>;
    }

    if (error) {
        return <div>Error al cargar los pedidos pendientes.</div>;
    }

    return (
        <TablaPedidosPendientes
            pedidos={pedidos}
        />
    );
};
