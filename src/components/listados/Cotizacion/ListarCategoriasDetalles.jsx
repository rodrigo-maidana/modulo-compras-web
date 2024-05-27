import React, { useState } from "react";
import { Table } from "react-bootstrap";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ModalProveedoresCotizacion from "./ModalProveedoresCotizacion";

const ListarCategoriasDetalles = ({ categorias = [] }) => {
    const [showModal, setShowModal] = useState(false);
    const [selectedCategoria, setSelectedCategoria] = useState(null);

    const handleShowModal = (categoria) => {
        setSelectedCategoria(categoria);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedCategoria(null);
    };

    return (
        <div>
            <Table striped bordered hover className="table-light table-striped table-bordered text-center">
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {categorias.map((categoria, index) => (
                        <tr key={index}>
                            <td>{categoria.nombre}</td>
                            <td className="text-center">
                                <button
                                    className="btn btn-lg mx-1"
                                    onClick={() => handleShowModal(categoria)}
                                >
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                            </td>
                        </tr>
                    ))}
                    {categorias.length === 0 && (
                        <tr>
                            <td colSpan="2" className="text-center">No hay categorías disponibles</td>
                        </tr>
                    )}
                </tbody>
            </Table>
            {selectedCategoria && (
                <ModalProveedoresCotizacion
                    show={showModal}
                    handleClose={handleCloseModal}
                    selectedCategoria={selectedCategoria}
                />
            )}
        </div>
    );
};

export default ListarCategoriasDetalles;
