// src/tablas/TablaFactura.jsx

import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";

const TablaFactura = ({ facturas, onAbrirModal }) => {
    const [filter, setFilter] = useState("");

    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const columns = useMemo(
        () => [
            { Header: "Número de Factura", accessor: "nroFactura" },
            { Header: "Timbrado", accessor: "timbrado" },
            { Header: "Proveedor", accessor: "proveedor.nombre" },
            { Header: "Ruc", accessor: "proveedor.ruc" },
            { Header: "Deposito", accessor: "deposito.nombre" },
            {
                Header: "Fecha de Emisión",
                accessor: "fechaEmision",
                Cell: ({ value }) => formatearFecha(value),
            },
            {
                Header: "Fecha de Vencimiento",
                accessor: "fechaVencimiento",
                Cell: ({ value }) => formatearFecha(value),
            },
            { Header: "Estado", accessor: "estado" },
            { Header: "Monto Total", accessor: "montoTotal" },
            { Header: "Saldo Pendiente", accessor: "saldoPendiente" },
            {
                Header: "Acciones",
                accessor: "acciones",
                Cell: ({ row }) => (
                    <div className="d-flex justify-content-center">
                        <button
                            className="btn btn-lg mx-auto"
                            onClick={() => onAbrirModal(row.original.id)}
                        >
                            <FontAwesomeIcon icon={faEye} />
                        </button>
                    </div>
                ),
            },
        ],
        []
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
        setGlobalFilter,
        state: { pageIndex },
    } = useTable(
        {
            columns,
            data: facturas,
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
        gotoPage(page - 1);
    };

    if (!facturas.length)
        return (
            <div className="text-center">
                <strong>Cargando...</strong>
            </div>
        );

    const totalPaginas = pageOptions.length;
    const maxPagesToShow = 9;
    const startPage = Math.floor(pageIndex / maxPagesToShow) * maxPagesToShow;
    const endPage = Math.min(startPage + maxPagesToShow, totalPaginas);

    return (
        <div className="container-fluid mt-5">
            <div className="mb-4">
                <h2>Listado de Facturas</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="text-center">
                        <div className="text-center d-flex mb-4">
                            <input
                                type="text"
                                className="form-control"
                                value={filter}
                                onChange={handleFilterChange}
                                placeholder="Buscar"
                            />
                        </div>
                        <div className="table-responsive">
                            <table
                                {...getTableProps()}
                                className="table table-bordered table-hover"
                            >
                                <thead className="thead-dark">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th
                                                    {...column.getHeaderProps()}
                                                    className="text-center"
                                                >
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
                                            <tr
                                                {...row.getRowProps()}
                                                className="text-center align-middle"
                                            >
                                                {row.cells.map((cell) => (
                                                    <td {...cell.getCellProps()} className="text-center">
                                                        {cell.render("Cell")}
                                                    </td>
                                                ))}
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="d-flex justify-content-center">
                            <nav>
                                <ul className="pagination">
                                    <li
                                        className={`page-item ${!canPreviousPage ? "disabled" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(1)}
                                            disabled={!canPreviousPage}
                                        >
                                            {"<<"}
                                        </button>
                                    </li>
                                    <li
                                        className={`page-item ${pageIndex === 0 ? "disabled" : ""}`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => previousPage()}
                                            disabled={pageIndex === 0}
                                        >
                                            {"<"}
                                        </button>
                                    </li>
                                    {Array.from(
                                        { length: endPage - startPage },
                                        (_, i) => startPage + i
                                    ).map((pageNumber) => (
                                        <li
                                            key={pageNumber}
                                            className={`page-item ${pageNumber === pageIndex ? "active" : ""
                                                }`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pageNumber + 1)}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li
                                        className={`page-item ${pageIndex === pageCount - 1 ? "disabled" : ""
                                            }`}
                                    >
                                        <button
                                            className="page-link"
                                            onClick={() => nextPage()}
                                            disabled={pageIndex === pageCount - 1}
                                        >
                                            {">"}
                                        </button>
                                    </li>
                                    <li className={`page-item ${!canNextPage ? "disabled" : ""}`}>
                                        <button
                                            className="page-link"
                                            onClick={() => handlePageChange(pageCount)}
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

export default TablaFactura;
