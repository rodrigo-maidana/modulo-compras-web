import React from "react";
import Button from "react-bootstrap/Button";

const DetalleTabla = ({
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
    <table className="table table-primary table-striped table-bordered text-center">
      <thead>
        <tr>
          <th>ID</th>
          <th>Producto</th>
          <th>Categoría</th>
          <th>Cantidad</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {console.log(detalles)}
        {detalles.map((item) => (
          <tr key={item.id}>
            <td>{item.id}</td>
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
                    Guardar
                  </Button>
                  <Button variant="danger" onClick={handleCancelarEdicion}>
                    Cancelar
                  </Button>
                </>
              ) : (
                <>{item.cantidad}</>
              )}
            </td>
            <td>
              <Button
                variant="danger"
                onClick={() => handleEliminarProducto(item.id)}
              >
                Eliminar
              </Button>{" "}
              <Button
                variant="primary"
                onClick={() => handleEditarCantidad(item)}
              >
                Modificar
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default DetalleTabla;
