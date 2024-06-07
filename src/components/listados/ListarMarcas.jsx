// ListarMarcas.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { ModalMarca } from "../modales/ModalMarca";
import { TablaMarcas } from "../tablas/TablaMarcas";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ListarMarcas = () => {
    const [show, setShow] = useState(false);
    const [marcas, setMarcas] = useState([]);
    const [marcaSeleccionada, setMarcaSeleccionada] = useState(null);
    const [isEdit, setIsEdit] = useState(false);

    const handleClose = () => {
        setShow(false);
        setMarcaSeleccionada(null);
    };

    const fetchMarcas = () => {
        axiosInstance
            .get("/marcas")
            .then((response) => {
                setMarcas(response.data);
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para acceder a este recurso.");
                } else {
                    console.error("Error: ", error);
                }
            });
    };

    const deleteMarca = (idMarca) => {
        axiosInstance
            .delete(`/marcas/${idMarca}`)
            .then(() => {
                fetchMarcas();
            })
            .catch((error) => {
                if (error.response && error.response.status === 403) {
                    console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para eliminar este recurso.");
                } else {
                    console.error("Error al eliminar la marca:", error);
                }
            });
    };

    const handleEditarMarca = (marca) => {
        setMarcaSeleccionada(marca);
        setShow(true);
        setIsEdit(true);
    };

    const handleCrearMarca = () => {
        setShow(true);
        setIsEdit(false);
        setMarcaSeleccionada(null);
    };

    useEffect(() => {
        fetchMarcas();
    }, []);

    return (
        <>
            <TablaMarcas
                marcas={marcas}
                deleteMarca={deleteMarca}
                handleEditarMarca={handleEditarMarca}
                handleCrearMarca={handleCrearMarca}
                faTrash={faTrash}
                faEdit={faEdit}
            />
            <ModalMarca
                show={show}
                handleClose={handleClose}
                marca={marcaSeleccionada}
                isEdit={isEdit}
                actualizarMarcas={fetchMarcas}
            />
        </>
    );
};
