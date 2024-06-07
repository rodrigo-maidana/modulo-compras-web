import React, { useMemo } from "react";
import { Modal, Button } from "react-bootstrap";
import { useTable } from "react-table";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../styles.css";

const ModalFacturas = ({ show, handleClose, factura }) => {
    const formatearFecha = (fecha) => {
        const date = new Date(fecha);
        const dia = date.getDate().toString().padStart(2, '0');
        const mes = (date.getMonth() + 1).toString().padStart(2, '0');
        const año = date.getFullYear();
        return `${dia}/${mes}/${año}`;
    };

    const columns = useMemo(
        () => [
            { Header: "Nombre", accessor: "producto.descripcion" },
            { Header: "Cantidad", accessor: "cantidad" },
            { Header: "Precio Unitario", accessor: "precioUnitario" },
            { Header: "Valor Total", accessor: (row) => (row.precioUnitario * row.cantidad).toFixed(0) },
        ],
        []
    );

    const data = useMemo(() => factura?.detalles || [], [factura]);

    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
    } = useTable({
        columns,
        data,
    });

    return (
        <Modal show={show} onHide={handleClose} size="lg" centered>
            <Modal.Header closeButton>
                <Modal.Title>Detalle de Factura</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {factura && (
                    <div className="container">
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>RUC</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={factura.proveedor.ruc}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>Timbrado</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={factura.timbrado}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>Fecha Emisión</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatearFecha(factura.fechaEmision)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>Fecha Vencimiento</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={formatearFecha(factura.fechaVencimiento)}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="row mb-3">
                            <div className="col-md-12">
                                <div className="form-group">
                                    <label><strong>Depósito</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={factura.deposito.nombre}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        <h5 className="mt-4">Productos</h5>
                        <div className="table-responsive mb-3">
                            <table {...getTableProps()} className="table table-striped table-hover">
                                <thead className="thead-dark">
                                    {headerGroups.map((headerGroup) => (
                                        <tr {...headerGroup.getHeaderGroupProps()}>
                                            {headerGroup.headers.map((column) => (
                                                <th {...column.getHeaderProps()} className="text-center">
                                                    {column.render("Header")}
                                                </th>
                                            ))}
                                        </tr>
                                    ))}
                                </thead>
                                <tbody {...getTableBodyProps()}>
                                    {rows.map((row) => {
                                        prepareRow(row);
                                        return (
                                            <tr {...row.getRowProps()} className="text-center align-middle">
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

                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>Valor Total</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={factura.montoTotal.toFixed(0)}
                                        readOnly
                                    />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-group">
                                    <label><strong>IVA Total</strong></label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        value={(factura.montoTotal / 11).toFixed(0)}
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cerrar
                </Button>
            </Modal.Footer>
            <ToastContainer />
        </Modal>
    );
};

export default ModalFacturas;
