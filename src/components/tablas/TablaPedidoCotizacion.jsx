import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import {
  faEdit,
  faTrash,
  faEye,
  faFilePdf,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "../styles.css";
import { Dropdown } from "react-bootstrap";

export const TablaPedidoCotizacion = ({
  pedidos,
  handleEditarPedido,
  handleCrearPDF,
  formatearFecha,
}) => {
  const [filter, setFilter] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [filteredPedidos, setFilteredPedidos] = useState(pedidos);

  useEffect(() => {
    let pedidosFiltrados = pedidos;

    if (estadoFiltro) {
      pedidosFiltrados = pedidosFiltrados.filter(
        (p) => p.estado === estadoFiltro
      );
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      fin.setDate(fin.getDate() + 1);
      pedidosFiltrados = pedidosFiltrados.filter((p) => {
        const fechaPedido = new Date(p.fechaEmision);
        return fechaPedido >= inicio && fechaPedido <= fin;
      });
    }

    setFilteredPedidos(pedidosFiltrados);
  }, [estadoFiltro, fechaInicio, fechaFin, pedidos]);

  const columns = useMemo(
    () => [
      {
        Header: "Fecha",
        accessor: "fechaEmision",
        Cell: ({ value }) => formatearFecha(value),
      },
      { Header: "Nro Cotizacion", accessor: "nroCotizacion" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Nro pedido relacionado", accessor: "pedidoCompra.nroPedido" },
      {
        Header: "Proveedor",
        accessor: "proveedor.nombre",
      },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-lg mx-1"
              onClick={() => handleEditarPedido(row.original)}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            {row.original.estado === "Pendiente" && (
              <button
                className="btn btn-lg mx-1"
                onClick={() => handleCrearPDF(row.original)}
              >
                <FontAwesomeIcon icon={faFilePdf} />
              </button>
            )}
          </div>
        ),
      },
    ],
    [handleEditarPedido, handleCrearPDF, formatearFecha]
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
      data: filteredPedidos,
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

  if (!pedidos.length)
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
    <div className="container mt-3">
      <div className="mb-4">
        <h2>Listado de pedidos de cotización</h2>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-12">
          <div className="text-center">
            <div className="text-center d-flex mb-4">
              <input
                type="text"
                className="form-control"
                onChange={handleFilterChange}
                placeholder="Buscar"
              />
            </div>
            <div className="d-flex justify-content-end mb-3 col-6 ">
              <h4 className="me-2">Filtros:</h4>
              <Dropdown className="ms-2">
                <Dropdown.Toggle variant="primary" id="dropdown-basic">
                  Filtrar por estado
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item onClick={() => setEstadoFiltro("")}>
                    Todos
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setEstadoFiltro("Pendiente")}>
                    Pendiente
                  </Dropdown.Item>
                  <Dropdown.Item onClick={() => setEstadoFiltro("Registrado")}>
                    Registrado
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <input
                type="date"
                className="form-control ms-2"
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <input
                type="date"
                className="form-control ms-2"
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            <table
              {...getTableProps()}
              className="table table-bordered table-hover"
            >
              <thead className="thead-dark">
                {headerGroups.map((headerGroup) => {
                  const { key: headerGroupKey, ...restHeaderGroupProps } =
                    headerGroup.getHeaderGroupProps();
                  return (
                    <tr key={headerGroupKey} {...restHeaderGroupProps}>
                      {headerGroup.headers.map((column) => {
                        const { key: columnKey, ...restColumnProps } =
                          column.getHeaderProps();
                        return (
                          <th
                            key={columnKey}
                            {...restColumnProps}
                            className="text-center"
                          >
                            {column.render("Header")}
                          </th>
                        );
                      })}
                    </tr>
                  );
                })}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  const { key: rowKey, ...restRowProps } = row.getRowProps();
                  return (
                    <tr
                      key={rowKey}
                      {...restRowProps}
                      className="text-center align-middle"
                    >
                      {row.cells.map((cell) => {
                        const { key: cellKey, ...restCellProps } =
                          cell.getCellProps();
                        return (
                          <td
                            key={cellKey}
                            {...restCellProps}
                            className="text-center"
                          >
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${
                      !canPreviousPage ? "disabled" : ""
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
                      className={`page-item ${
                        pageNumber === pageIndex ? "active" : ""
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
                    className={`page-item ${
                      pageIndex === pageCount - 1 ? "disabled" : ""
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
