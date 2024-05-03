import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import App from "../App";


import React from 'react'

const ModalPedidosDetalles = (id) => {
  return (
    <div>
            <h2>Categorías</h2>
      <table className='table table-dark table-striped table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {categorias.map(categoria => (
            <tr key={categoria.id}>
              <td>{categoria.id}</td>
              <td>{categoria.nombre}</td>
              <td>
                <button onClick={() => eliminarCategoria(categoria.id)} className='btn btn-danger'>Eliminar</button>
                <button onClick={() => modificarCategoria(categoria)} className='btn btn-primary'>Modificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
    </div>
  )
}

export default ModalPedidosDetalles
