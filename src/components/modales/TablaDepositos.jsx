import React, { useMemo, useEffect, useState } from 'react';
import { useTable, usePagination, useGlobalFilter } from 'react-table';
import axios from 'axios';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const TablaDepositos = ({ depositos, deleteDeposito, handleEditarDeposito, faTrash, faEdit }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState("");

    // Cargar datos desde la API
    useEffect(() => {
        setData(depositos); // Setea los datos de los depositos recibidos por props
        setLoading(false);
    }, [depositos]); // Ejecuta cuando cambian los depositos

    // Definir las columnas para react-table
    const columns = useMemo(() => [
        {
            Header: 'ID',
            accessor: 'id',
        },
        {
            Header: 'Nombre',
            accessor: 'nombre',
        },
        {
            Header: 'Direccion',
            accessor: 'direccion',
        },
        {
            Header: 'Contacto',
            accessor: 'contacto',
        }
    ], []);

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
        state: { pageIndex, pageSize }
    } = useTable({
        columns,
        data,
        initialState: { pageIndex: 0 },
    }, useGlobalFilter, usePagination);

    // Manejador para el cambio en el input de filtro
    const handleFilterChange = e => {
        const value = e.target.value || undefined;
        setFilter(value);
        setGlobalFilter(value);
    };

    if (loading) return <div className="text-center"><strong>Cargando...</strong></div>;

    const iconoEstilo = {
        marginRight: '10px' // Ajusta el valor según sea necesario
    };

    return (
        <div className="container mt-5">
            <input
                type="text"
                className="form-control mb-4"
                value={filter}
                onChange={handleFilterChange}
                placeholder="Buscar"
            />
            <table {...getTableProps()} className="table table-bordered table-hover">
                <thead className="thead-dark">
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th {...column.getHeaderProps()}>{column.render('Header')}</th>
                            ))}
                            <th>Editar</th> {/* Columna para editar */}
                            <th>Eliminar</th> {/* Columna para eliminar */}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {page.map(row => {
                        prepareRow(row);
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
                                })}
                                <td>
                                    <span
                                        style={iconoEstilo}
                                        onClick={() => handleEditarDeposito(row.original)}
                                    >
                                        <FontAwesomeIcon icon={faEdit} />
                                    </span>
                                </td>
                                <td>
                                    <span onClick={() => deleteDeposito(row.original.id)}>
                                        <FontAwesomeIcon icon={faTrash} />
                                    </span>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            {/* Renderiza controles de paginación */}
            <div className="pagination">
                <button className="btn btn-primary" onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
                    {'<<'}
                </button>
                <button className="btn btn-primary" onClick={() => previousPage()} disabled={!canPreviousPage}>
                    {'<'}
                </button>
                <button className="btn btn-primary" onClick={() => nextPage()} disabled={!canNextPage}>
                    {'>'}
                </button>
                <button className="btn btn-primary" onClick={() => gotoPage(pageCount - 1)} disabled={!canNextPage}>
                    {'>>'}
                </button>
                <span className="pagination-info">
                    Página{' '}
                    <strong>
                        {pageIndex + 1} de {pageOptions.length}
                    </strong>{' '}
                </span>
                <select
                    className="form-control"
                    value={pageSize}
                    onChange={e => {
                        setPageSize(Number(e.target.value));
                    }}
                    style={{ width: 'auto', display: 'inline-block' }}
                >
                    {[10, 20, 30, 40, 50].map(pageSize => (
                        <option key={pageSize} value={pageSize}>
                            {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
