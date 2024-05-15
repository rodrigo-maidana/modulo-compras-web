import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalProducto } from "./ModalProductos";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ListarProductos = () => {
    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true);
        setIsEdit(false);
    };

    const [productos, setProductos] = useState([]);
    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [isEdit, setIsEdit] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);

    const productosPorPagina = 15;

    const fetchProductos = () => {
        axios
            .get("https://api.rodrigomaidana.com:8080/productos")
            .then((response) => {
                setProductos(response.data);
            })
            .catch((error) => {
                console.log("error: ", error);
            });
    };

    const deleteProducto = (idProducto) => {
        axios
            .delete(`https://api.rodrigomaidana.com:8080/productos/${idProducto}`)
            .then(() => {
                fetchProductos();
            })
            .catch((error) => {
                console.log("Error al eliminar el producto:", error);
            });
    };

    useEffect(() => {
        fetchProductos();
    }, []);

    const actualizarProductos = () => {
        fetchProductos();
    };

    const handleEditarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setShow(true);
        setIsEdit(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Calcula los productos a mostrar en la página actual
    const indexOfLastProducto = currentPage * productosPorPagina;
    const indexOfFirstProducto = indexOfLastProducto - productosPorPagina;
    const currentProductos = productos.slice(indexOfFirstProducto, indexOfLastProducto);

    const totalPaginas = Math.ceil(productos.length / productosPorPagina);
    const iconoEstilo = {
        marginRight: '10px'
    };

    return (
        <>
            <div className="container">
                <div className="p-1 ps-4">
                    <h1>Listado de productos</h1>
                </div>
                <div className="col-12 p-3 ">
                    <table className="table table-secondary col-8">
                        <thead>
                            <tr>
                                <th>Id</th>
                                <th>Descripción</th>
                                <th>Marca</th>
                                <th>Categoría</th>
                                <th>Opciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentProductos.map((producto) => (
                                <tr className="table-secondary" key={producto.id}>
                                    <td>{producto.id}</td>
                                    <td>{producto.descripcion}</td>
                                    <td>{producto.marca.nombre}</td>
                                    <td>{producto.categoria.nombre}</td>
                                    <td>
                                        <span
                                            style={iconoEstilo}
                                            onClick={() => handleEditarProducto(producto)}
                                        >
                                            <FontAwesomeIcon icon={faEdit} />
                                        </span>
                                        <span onClick={() => deleteProducto(producto.id)}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="text-end">
                        <button
                            type="submit"
                            className="btn btn-primary m-2"
                            onClick={handleShow}
                        >
                            Crear producto
                        </button>
                    </div>
                    <div className="d-flex justify-content-center">
                        <nav>
                            <ul className="pagination">
                                {[...Array(totalPaginas)].map((_, index) => (
                                    <li
                                        key={index}
                                        className={`page-item ${currentPage === index + 1 ? "active" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(index + 1)}
                                        >
                                            {index + 1}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            </div>
            <ModalProducto
                show={show}
                handleClose={() => {
                    setShow(false);
                    setProductoSeleccionado(null);
                }}
                actualizarProductos={actualizarProductos}
                producto={productoSeleccionado}
                isEdit={isEdit}
            />
        </>
    );
};
