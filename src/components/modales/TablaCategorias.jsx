// TablaCategorias.jsx
import React, { useMemo, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TablaCategorias = ({
  categorias,
  deleteCategoria,
  handleEditarCategoria,
  handleCrearCategoria,
}) => {
  const [filter, setFilter] = useState("");

  const columns = useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Nombre", accessor: "nombre" },
      {
        Header: "Acciones",
        accessor: "acciones",
        Cell: ({ row }) => (
          <div className="d-flex justify-content-center">
            <button
              className="btn btn-lg mx-1"
              onClick={() => handleEditarCategoria(row.original)}
            >
              <FontAwesomeIcon icon={faEdit} />
            </button>
            <button
              className="btn btn-lg mx-1"
              onClick={() => deleteCategoria(row.original.id)}
            >
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        ),
      },
    ],
    [handleEditarCategoria, deleteCategoria]
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
      data: categorias,
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

  if (!categorias.length)
    return (
      <div className="text-center">
        <strong>Cargando...</strong>
      </div>
    );

  const totalPaginas = pageOptions.length;
  const maxPagesToShow = 10;
  const startPage = Math.floor(pageIndex / maxPagesToShow) * maxPagesToShow;
  const endPage = Math.min(startPage + maxPagesToShow, totalPaginas);

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <h1>Listado de Categorías</h1>
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
              <div className="text-right mx-4">
                <button
                  className="btn btn-primary px-5"
                  onClick={handleCrearCategoria}
                >
                  Crear
                </button>
              </div>
            </div>
            <table
              {...getTableProps()}
              className="table table-bordered table-hover"
            >
              <thead className="thead-dark">
                {headerGroups.map((headerGroup) => (
                  <tr
                    key={headerGroup.id}
                    {...headerGroup.getHeaderGroupProps()}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        key={column.id}
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
                    <tr key={row.id} {...row.getRowProps()}>
                      {row.cells.map((cell) => (
                        <td
                          key={cell.column.id}
                          {...cell.getCellProps()}
                          className="text-center align-middle"
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
                  {Array.from({ length: endPage - startPage }, (_, i) => startPage + i).map((pageNumber) => (
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
