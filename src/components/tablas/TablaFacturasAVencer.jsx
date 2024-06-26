// File: TablaFacturasAVencer.jsx
import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import "../styles.css";

// Función para formatear la fecha
const formatDate = (dateString) => {
    const options = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
};

// Función para formatear los números
const formatNumber = (number) => {
    return new Intl.NumberFormat('es-ES').format(number);
};

export const TablaFacturasAVencer = ({
    facturas
}) => {
    const [filter, setFilter] = useState("");

    const columns = useMemo(
        () => [
            { Header: "Nombre Proveedor", accessor: "proveedor.nombre" },
            { Header: "Estado Factura", accessor: "estado" },
            { Header: "Fecha de Emisión", accessor: "fechaEmision", Cell: ({ value }) => formatDate(value) },
            { Header: "Fecha de Vencimiento", accessor: "fechaVencimiento", Cell: ({ value }) => formatDate(value) },
            { Header: "Número de Orden de Compra", accessor: "ordenCompra.nroOrdenCompra" },
            { Header: "Número de Factura", accessor: "nroFactura" },
            { Header: "Condición", accessor: "condicion" },
            { Header: "Monto Total", accessor: "montoTotal", Cell: ({ value }) => formatNumber(value) },
            { Header: "Saldo Pendiente", accessor: "saldoPendiente", Cell: ({ value }) => formatNumber(value) },
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

    if (!facturas.length) {
        return (
            <div className="text-center">
                <strong>No hay facturas vencidas este mes.</strong>
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
                <h2>Listado de Facturas con Vencimiento este Mes</h2>
            </div>
            <div className="row justify-content-center">
                <div className="col-md-12">
                    <div className="text-center">
                        <div className="text-center d-flex">
                            <input
                                type="text"
                                className="form-control mb-4"
                                value={filter}
                                onChange={handleFilterChange}
                                placeholder="Buscar"
                            />
                        </div>
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
                                                        ["proveedor.nombre", "ordenCompra.estado", "fechaEmision", "fechaVencimiento", "ordenCompra.nroOrdenCompra", "nroFactura", "condicion", "montoTotal", "saldoPendiente"].includes(cell.column.id)
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
