import React, { useMemo, useState, useEffect } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faMoneyBill1Wave } from "@fortawesome/free-solid-svg-icons";
import "../styles.css";
import { Dropdown } from "react-bootstrap";

export const TablaFactura = ({ facturas, handleAbrirModal, ordenPago }) => {
  const [filter, setFilter] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");
  const [estadoFiltro, setEstadoFiltro] = useState("");
  const [filteredFacturas, setFilteredFacturas] = useState(facturas);

  useEffect(() => {
    let facturasFiltradas = facturas;

    if (filter) {
      facturasFiltradas = facturasFiltradas.filter(
        (factura) =>
          factura.proveedor.nombre
            .toLowerCase()
            .includes(filter.toLowerCase()) ||
          factura.nroFactura.toLowerCase().includes(filter.toLowerCase())
      );
    }
    if (estadoFiltro) {
      facturasFiltradas = facturasFiltradas.filter(
        (factura) => factura.estado === estadoFiltro
      );
    }

    if (fechaInicio && fechaFin) {
      const inicio = new Date(fechaInicio);
      const fin = new Date(fechaFin);
      facturasFiltradas = facturasFiltradas.filter((factura) => {
        const fechaEmision = new Date(factura.fechaEmision);
        return fechaEmision >= inicio && fechaEmision <= fin;
      });
    }

    setFilteredFacturas(facturasFiltradas);
  }, [filter, estadoFiltro, fechaInicio, fechaFin, facturas]);

  const formatearFecha = (fecha) => {
    const date = new Date(fecha);
    const dia = date.getDate().toString().padStart(2, "0");
    const mes = (date.getMonth() + 1).toString().padStart(2, "0");
    const año = date.getFullYear();
    return `${dia}/${mes}/${año}`;
  };

  const formatearNumero = (numero) => {
    return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  const columns = useMemo(
    () => [
      {
        Header: "Fecha de Emisión",
        accessor: "fechaEmision",
        Cell: ({ value }) => formatearFecha(value),
      },
      { Header: "Número de Factura", accessor: "nroFactura" },
      { Header: "Timbrado", accessor: "timbrado" },
      { Header: "Proveedor", accessor: "proveedor.nombre" },
      { Header: "RUC", accessor: "proveedor.ruc" },
      { Header: "Depósito", accessor: "deposito.nombre" },
      { Header: "Estado", accessor: "estado" },
      { Header: "Monto Total", accessor: "montoTotal", Cell: ({ value }) => formatearNumero(value) },
      { Header: "Saldo Pendiente", accessor: "saldoPendiente", Cell: ({ value }) => formatearNumero(value) },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-lg mx-1"
              onClick={() => handleAbrirModal(row.original)}
            >
              <FontAwesomeIcon icon={faEye} />
            </button>
            <button
              className="btn mx-1"
              onClick={() => {
                ordenPago(row.original.id);
              }}
            >
              <FontAwesomeIcon icon={faMoneyBill1Wave} />
            </button>
          </div>
        ),
      },
    ],
    [handleAbrirModal, ordenPago]
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
      data: filteredFacturas,
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

  if (!filteredFacturas.length)
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
            <div className="d-flex justify-content-end mb-3 col-6">
              <h4 className="me-2">Filtros:</h4>
              <Dropdown className="me-2">
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
                  <Dropdown.Item onClick={() => setEstadoFiltro("Pagado")}>
                    Pagado
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
              <input
                type="date"
                className="form-control mx-2"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
              <input
                type="date"
                className="form-control mx-2"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
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
