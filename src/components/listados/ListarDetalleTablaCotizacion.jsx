import React from "react";
import Button from "react-bootstrap/Button";
import { faEdit, faTrash, faCircleXmark, faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListarDetalleTablaCotizacion = ({
    detalles,
    editandoProducto,
    nuevaCantidad,
    handleGuardarCantidad,
    handleCancelarEdicion,
    handleEliminarProducto,
    handleEditarCantidad,
    setNuevaCantidad,
}) => {
    return (
        <table className="table table-light table-striped table-bordered text-center">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                </tr>
            </thead>
            <tbody>
                {detalles.map((item, index) => (
                    <tr key={item.id}>
                        <td>{index + 1}</td>
                        <td>{item.producto.descripcion}</td>
                        <td>
                            {editandoProducto && editandoProducto.id === item.id ? (
                                <>
                                    <input
                                        className="col-3 me-2"
                                        type="number"
                                        value={nuevaCantidad}
                                        onChange={(e) => setNuevaCantidad(e.target.value)}
                                    />
                                    <Button variant="primary" onClick={handleGuardarCantidad}>
                                        <FontAwesomeIcon icon={faFloppyDisk} />
                                    </Button>
                                    <Button className="mx-2" variant="secondary" onClick={handleCancelarEdicion}>
                                        <FontAwesomeIcon icon={faCircleXmark} />
                                    </Button>
                                </>
                            ) : (
                                <>{item.cantidad}</>
                            )}
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
};

export default ListarDetalleTablaCotizacion;
