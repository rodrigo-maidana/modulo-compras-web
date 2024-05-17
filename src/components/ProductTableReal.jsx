import React, { useMemo, useEffect, useState } from "react";
import { useTable, usePagination, useGlobalFilter } from "react-table";
import axios from "axios";
import axiosInstance from "./axiosInstance";
export const ProductTableReal = ({ handleAgregarProducto }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  //estado para la cantidad
  const [productQuantities, setProductQuantities] = useState({});

  //manejar cambios de cantidad para actualizar
  const handleQuantityChange = (productId, quantity) => {
    setProductQuantities({ ...productQuantities, [productId]: quantity });
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

  if (loading)
    return (
      <div className="text-center">
        <strong>Cargando...</strong>
      </div>
    );

  return (
    <div className="container">
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
              <th>Cantidad</th> {/* New column */}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            const productId = row.original.id;
            const productQuantity = productQuantities[productId] || 0;
            return (
              <tr {...row.getRowProps()} key={row.original.id}>
                {row.cells.map((cell) => {
                  return (
                    <td {...cell.getCellProps()} key={cell.getCellProps().key}>
                      {cell.render("Cell")}
                    </td>
                  );
                })}
                <td>
                  <input
                    className="col-3 mx-2"
                    type="number"
                    value={productQuantity}
                    onChange={(e) =>
                      handleQuantityChange(productId, e.target.value)
                    }
                  />
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      handleAgregarProducto(row.original, productQuantity)
                    }
                    disabled={productQuantity <= 0}
                  >
                    Agregar
                  </button>
                </td>{" "}
                {/* New column */}
              </tr>
            );
          })}
        </tbody>
      </table>
      {/* Renderiza controles de paginación */}
      <div className="pagination">
        <button
          className="btn btn-primary "
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          {"<"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          {">"}
        </button>
        <button
          className="btn btn-primary"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
        <span className="pagination-info">
          Página{" "}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{" "}
        </span>
        <select
          className="form-control"
          value={pageSize}
          onChange={(e) => {
            setPageSize(Number(e.target.value));
          }}
          style={{ width: "auto", display: "inline-block" }}
        >
          {[5, 10, 20, 30, 40, 50].map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
