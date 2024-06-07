// src/components/listados/ListarFacturas.jsx

import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import TablaFactura from "../tablas/TablaFacturas";
import ModalFactura from "../modales/ModalFacturas";

export const ListarFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [selectedFacturaId, setSelectedFacturaId] = useState(null);

    const fetchFacturas = () => {
        axiosInstance
            .get("/facturas")
            .then((response) => {
                setFacturas(response.data);
            })
            .catch((error) => {
                console.log("Error al cargar las facturas: ", error);
            });
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    const handleAbrirModal = (id) => {
        setSelectedFacturaId(id);
        setShowModal(true);
    };

    const handleCerrarModal = () => {
        setShowModal(false);
        setSelectedFacturaId(null);
    };

    return (
        <div className="container-fluid mt-5">
            <h1>Lista de Facturas</h1>
            <TablaFactura
                facturas={facturas}
                onAbrirModal={handleAbrirModal}
            />
            {selectedFacturaId && (
                <ModalFactura
                    id={selectedFacturaId}
                    show={showModal}
                    handleClose={handleCerrarModal}
                />
            )}
        </div>
    );
};

export default ListarFacturas;
