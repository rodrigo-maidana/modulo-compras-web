// File: TablaPedidosPendientes.jsx
import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import "../styles.css";

// Función para formatear la fecha
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

export const TablaPedidosPendientes = ({
    pedidos
}) => {
    const [filter, setFilter] = useState("");

    const columns = useMemo(
        () => [
            {
                Header: "Fecha de Emisión",
                accessor: "fechaEmision",
                Cell: ({ value }) => formatDate(value) // Formatear la fecha aquí
            },
            { Header: "Estado", accessor: "estado" },
            { Header: "Número de Pedido", accessor: "nroPedido" },
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
        setPageSize,
        setGlobalFilter,
        state: { pageIndex, pageSize },
    } = useTable(
        {
            columns,
            data: pedidos,
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

    if (!pedidos.length) {
        return (
            <div className="text-center">
                <strong>No hay pedidos pendientes.</strong>
            </div>
        );
    }

    const totalPaginas = pageOptions.length;
    const maxPagesToShow = 10;
    const startPage = Math.floor(pageIndex / maxPagesToShow) * maxPagesToShow;
    const endPage = Math.min(startPage + maxPagesToShow, totalPaginas);

    return (
        <div className="container mt-5">
            <div className="mb-4">
                <h2>Listado de Pedidos Pendientes</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="text-center">
                        <table
                            {...getTableProps()}
                            className="table table-bordered table-hover"
                        >
                            <thead className="thead-dark">
                                {headerGroups.map((headerGroup) => (
                                    <tr {...headerGroup.getHeaderGroupProps()}>
                                        {headerGroup.headers.map((column) => (
                                            <th {...column.getHeaderProps()}>
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
                                        <tr {...row.getRowProps()}>
                                            {row.cells.map((cell) => (
                                                <td
                                                    {...cell.getCellProps()}
                                                    className="align-middle"
                                                    style={
                                                        ["fechaEmision", "estado", "nroPedido"].includes(cell.column.id)
                                                            ? { textAlign: "left" }
                                                            : { textAlign: "center" }
                                                    }
                                                >
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
                                    <li className={`page-item ${pageIndex === 0 ? "disabled" : ""}`}>
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
                                            className={`page-item ${pageNumber === pageIndex ? "active" : ""}`}
                                        >
                                            <button
                                                className="page-link"
                                                onClick={() => handlePageChange(pageNumber + 1)}
                                            >
                                                {pageNumber + 1}
                                            </button>
                                        </li>
                                    ))}
                                    <li className={`page-item ${pageIndex === pageCount - 1 ? "disabled" : ""}`}>
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
