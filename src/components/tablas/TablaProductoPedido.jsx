import React, { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axiosInstance from "../axiosInstance";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TablaProductoPedido = ({ handleAgregarProducto }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  // Estado para la cantidad
  const [productQuantities, setProductQuantities] = useState({});

  // Manejar cambios de cantidad para actualizar
  const handleQuantityChange = (productId, quantity) => {
    if (quantity >= 0) {
      setProductQuantities({ ...productQuantities, [productId]: quantity });
    }
  };

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
      {
        Header: "Cantidad",
        accessor: "cantidad",
        Cell: ({ row }) => {
          const productId = row.original.id;
          const productQuantity = productQuantities[productId] || 0;
          return (
            <div className="d-flex align-items-center">
              <input
                className="form-control me-3"
                type="number"
                min="0"
                value={productQuantity}
                onChange={(e) =>
                  handleQuantityChange(productId, Number(e.target.value))
                }
              />
              <button
                className="btn btn-primary"
                onClick={() => {
                  handleAgregarProducto(row.original, productQuantity);
                  handleQuantityChange(productId, 0); // Restablece la cantidad a 0 después de agregar
                }}
                disabled={productQuantity <= 0}
              >
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
            </div>
          );
        },
      },
    ],
    [productQuantities, handleAgregarProducto]
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
      initialState: { pageIndex: 0, pageSize: 5 },
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

  const handlePageChange = (page) => {
    gotoPage(page - 1);
  };

  if (loading)
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
    <div className="container mt-1">
      <div className="mb-4">
        <h1>Listado de productos</h1>
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
                  <tr
                    {...headerGroup.getHeaderGroupProps()}
                    key={headerGroup.id}
                  >
                    {headerGroup.headers.map((column) => (
                      <th
                        {...column.getHeaderProps()}
                        key={column.id}
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
                      key={row.id}
                      className="text-center align-middle"
                    >
                      {row.cells.map((cell) => (
                        <td
                          {...cell.getCellProps()}
                          key={cell.column.id}
                          className="text-center"
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
