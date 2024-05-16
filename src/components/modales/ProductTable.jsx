import React, { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";

export const ProductTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  // Cargar datos desde la API
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          "https://api.rodrigomaidana.com:8080/productos"
        );
        setData(response.data); // Asumiendo que la API devuelve un arreglo de productos
      } catch (error) {
        console.error("Error al cargar datos:", error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  // Definir las columnas para react-table
  const columns = useMemo(
    () => [
      {
        Header: "ID",
        accessor: "id",
      },
      {
        Header: "Marca",
        accessor: "marca.nombre",
      },
      {
        Header: "Categoría",
        accessor: "categoria.nombre",
      },
      {
        Header: "Descripción",
        accessor: "descripcion",
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
    setPageSize,
    setGlobalFilter,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0 },
    },
    useGlobalFilter,
    usePagination
  );

  // Manejador para el cambio en el input de filtro
  const handleFilterChange = (e) => {
    const value = e.target.value || undefined;
    setFilter(value);
    setGlobalFilter(value);
  };

  // Manejador para cambio de página
  const handlePageChange = (page) => {
    setCurrentPage(page);
    gotoPage(page - 1);
  };

  if (loading)
    return (
      <div className="text-center">
        <strong>Cargando...</strong>
      </div>
    );

  const totalPaginas = pageOptions.length;

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-8">
          <div className="text-center">
            <input
              type="text"
              className="form-control mb-4"
              value={filter}
              onChange={handleFilterChange}
              placeholder="Buscar"
            />
            <table {...getTableProps()} className="table table-bordered table-hover">
              <thead className="thead-dark">
                {headerGroups.map((headerGroup) => (
                  <tr {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                    ))}
                    <th>Seleccione para Agregar</th> {/* New column */}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                  prepareRow(row);
                  return (
                    <tr {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        );
                      })}
                      <td>
                        <input type="checkbox" />
                      </td>{" "}
                      {/* New column */}
                    </tr>
                  );
                })}
              </tbody>
            </table>
            {/* Renderiza controles de paginación */}
            <div className="d-flex justify-content-center">
              <nav>
                <ul className="pagination">
                  <li
                    className={`page-item ${!canPreviousPage ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(1)}
                      disabled={!canPreviousPage}
                    >
                      {"Primera página"}
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
                  <li
                    className={`page-item ${!canNextPage ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(totalPaginas)}
                      disabled={!canNextPage}
                    >
                      {"Última página"}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
            <span className="pagination-info">
              Página{" "}
              <strong>
                {pageIndex + 1} de {pageOptions.length}
              </strong>{" "}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
