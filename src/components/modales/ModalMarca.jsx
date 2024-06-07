import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FormMarcas } from "../forms/FormMarcas";

export const ModalMarca = ({
    show,
    handleClose,
    actualizarMarcas,
    marca,
    isEdit,
}) => {
    return (
        <>
            <Modal show={show} onHide={handleClose} size="xl">
                <Modal.Header>
                    <Modal.Title className="p-1">
                        <h1>{isEdit ? "Editar Marca" : "Crear Marca"}</h1>
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <FormMarcas
                        marca={marca}
                        actualizarMarcas={actualizarMarcas}
                        isEdit={isEdit}
                        handleClose={handleClose}
                    />
                </Modal.Body>
            </Modal>
        </>
    );
};
