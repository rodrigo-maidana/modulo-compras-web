// TablaDepositos.jsx
import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TablaDepositos = ({ depositos, deleteDeposito, handleEditarDeposito, handleCrearDeposito }) => {
    const [filter, setFilter] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Definir las columnas para react-table
    const columns = useMemo(
        () => [
            { Header: "ID", accessor: "id" },
            { Header: "Nombre", accessor: "nombre" },
            { Header: "Direccion", accessor: "direccion" },
            { Header: "Contacto", accessor: "contacto" },
            {
                Header: "Acciones",
                accessor: "acciones",
                Cell: ({ row }) => (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-lg"
                            onClick={() => handleEditarDeposito(row.original)}
                        >
                            <FontAwesomeIcon icon={faEdit} />
                        </button>
                        <button
                            className="btn btn-lg"
                            onClick={() => deleteDeposito(row.original.id)}
                        >
                            <FontAwesomeIcon icon={faTrash} />
                        </button>
                    </div>
                ),
            },
        ],
        [handleEditarDeposito, deleteDeposito]
    );

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        page,
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: depositos,
            initialState: { pageIndex: 0 },
        },
        useGlobalFilter,
        usePagination
    );

    const handleFilterChange = (e) => {
        const value = e.target.value || undefined;
        setFilter(value);
        setGlobalFilter(value);
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
        gotoPage(page - 1);
    };

    if (!depositos.length) return <div className="text-center"><strong>Cargando...</strong></div>;

    const totalPaginas = pageOptions.length;
    const iconoEstilo = { marginRight: '0px' };

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <h1>Listado de Depositos</h1>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="text-center align-middle">
                        <div className="text-center d-flex">
                            <input
                                type="text"
                                className="form-control mb-4"
                                value={filter}
                                onChange={handleFilterChange}
                                placeholder="Buscar"
                            />
                            <div className="text-right mx-4">
                                <button
                                    className="btn btn-primary px-5"
                                    onClick={handleCrearDeposito}
                                >
                                    Crear
                                </button>
                            </div>
                        </div>
                        <table {...getTableProps()} className="table table-bordered table-hover">
                            <thead className="thead-dark">
                                {headerGroups.map((headerGroup) => (
                                    <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th key={column.id} {...column.getHeaderProps()}
                                                className="text-center align-middle">
                                                {column.render("Header")}
                                            </th>
                                        ))}
                                    </tr>
                                ))}
                            </thead>
                            <tbody {...getTableBodyProps()}>

                                {page.map((row) => {
                                    prepareRow(row);
                                    return (
                                        <tr key={row.id} {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <td key={cell.column.id} {...cell.getCellProps()}
                                                    className="text-center align-middle">
                                                    {cell.render("Cell")}
                                                </td>
                                            ))}
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                        <div className="d-flex justify-content-center">
                            <nav>
                                <ul className="pagination">
                                    <li className={`page-item ${!canPreviousPage ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(1)}
                                            disabled={!canPreviousPage}
                                        >
                                            {"<<"}
                                        </button>
                                    </li>
                                    <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage - 1)}
                                            disabled={currentPage === 1}
                                        >
                                            {"<"}
                                        </button>
                                    </li>
                                    {currentPage > 1 && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage - 1)}
                                            >
                                                {currentPage - 1}
                                            </button>
                                        </li>
                                    )}
                                    <li className="page-item active">
                                        <button className="page-link">{currentPage}</button>
                                    </li>
                                    {currentPage < totalPaginas && (
                                        <li className="page-item">
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(currentPage + 1)}
                                            >
                                                {currentPage + 1}
                                            </button>
                                        </li>
                                    )}
                                    <li className={`page-item ${currentPage === totalPaginas ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(currentPage + 1)}
                                            disabled={currentPage === totalPaginas}
                                        >
                                            {">"}
                                        </button>
                                    </li>
                                    <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(totalPaginas)}
                                            disabled={!canNextPage}
                                        >
                                            {">>"}
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
