import React from "react";
import Button from "react-bootstrap/Button";
import {
  faEdit,
  faTrash,
  faCircleXmark,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const ListarDetalleTabla = ({
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
    <>
      <table className="table table-light table-striped table-bordered text-center">
        <thead>
          <tr>
            <th>#</th>
            <th>Producto</th>
            <th>Categoría</th>
            <th>Cantidad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {detalles.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.producto.descripcion}</td>
              <td>{item.producto.categoria?.nombre}</td>
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
                    <Button
                      className="mx-2"
                      variant="secondary"
                      onClick={handleCancelarEdicion}
                    >
                      <FontAwesomeIcon icon={faCircleXmark} />
                    </Button>
                  </>
                ) : (
                  <>{item.cantidad}</>
                )}
              </td>
              <td>
                <Button
                  variant="secondary"
                  onClick={() => handleEliminarProducto(item.id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                </Button>{" "}
                <Button
                  variant="secondary"
                  onClick={() => handleEditarCantidad(item)}
                >
                  <FontAwesomeIcon icon={faEdit} />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default ListarDetalleTabla;
