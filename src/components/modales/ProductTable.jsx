import React, { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axiosInstance from "../axiosInstance";

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
        const response = await axiosInstance.get(
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

  const iconoEstilo = {
    marginRight: '10px' // Ajusta el valor según sea necesario
  };

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h1>Listado de Algo</h1>
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

              {/* Botón de crear */}
              <div className="text-right mx-4">
                <button className="btn btn-primary px-5">Crear</button>
                {/*Añadirle utilidad*/}
              </div>

            </div>
            <table {...getTableProps()} className="table table-bordered table-hover">
              <thead className="thead-dark">
                {headerGroups.map((headerGroup) => (
                  <tr key={headerGroup.id} {...headerGroup.getHeaderGroupProps()}>
                    {headerGroup.headers.map((column) => (
                      <th key={column.id} {...column.getHeaderProps()}>
                        {column.render("Header")}
                      </th>
                    ))}
                    <th>Acciones</th> {/* New column */}
                  </tr>
                ))}
              </thead>
              <tbody {...getTableBodyProps()}>
                {page.map((row, index) => {
                  prepareRow(row);
                  return (
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map((cell) => {
                        return (
                          <td key={cell.column.id} {...cell.getCellProps()}>
                            {cell.render("Cell")}
                          </td>
                        );
                      })}
                      <td>
                        <button
                          className="btn"
                          style={iconoEstilo}
                        //Añadir Funcion
                        >
                          <FontAwesomeIcon icon={faEdit} />
                        </button>

                        <button
                          className="btn"
                          style={iconoEstilo}
                        //Añadir Funcion
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </td>

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
                      {"<<"}
                    </button>
                  </li>
                  <li
                    className={`page-item ${currentPage === 1 ? "disabled" : ""}`}
                  >
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
                  <li
                    className={`page-item ${currentPage === totalPaginas ? "disabled" : ""}`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPaginas}
                    >
                      {">"}
                    </button>
                  </li>
                  <li
                    className={`page-item ${!canNextPage ? "disabled" : ""}`}
                  >
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