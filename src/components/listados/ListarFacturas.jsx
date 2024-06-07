import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import TablaFactura from "../tablas/TablaFacturas";
import ModalFactura from "../modales/ModalFacturas";

export const ListarFacturas = () => {
    const [facturas, setFacturas] = useState([]);
    const [selectedFactura, setSelectedFactura] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const fetchFacturas = () => {
        axiosInstance
            .get("/facturas")
            .then((response) => {
                setFacturas(response.data);
            })
            .catch((error) => console.log("Error al cargar las facturas: ", error));
    };

    useEffect(() => {
        fetchFacturas();
    }, []);

    const handleClose = () => {
        setShowModal(false);
    };

    const handleAbrirModal = async (factura) => {
        try {
            const response = await axiosInstance.get(`/facturas/${factura.id}/detalles`);
            setSelectedFactura({ ...factura, detalles: response.data });
            setShowModal(true);
        } catch (error) {
            console.error("Error al cargar los detalles de la factura:", error);
        }
    };

    return (
        <>
            <TablaFactura
                facturas={facturas}
                handleAbrirModal={handleAbrirModal}
            />
            {selectedFactura && (
                <ModalFactura
                    factura={selectedFactura}
                    show={showModal}
                    handleClose={handleClose}
                />
            )}
        </>
    );
};

export default ListarFacturas;
