import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListarDepositos() {
  const [depositos, setDepositos] = useState([]);
  const [nombre, setNombre] = useState('');
  const [direccion, setDireccion] = useState('');
  const [contacto, setContacto] = useState('')
  const [depositoSeleccionado, setDepositoSeleccionado] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNombreDeposito, setNuevoNombreDeposito] = useState('');
  const [nuevoDireccionDeposito, setNuevoDireccionDeposito] = useState('');
  const [nuevoContactoDeposito, setNuevoContactoDeposito] = useState('');


  // Función para cargar las categorías desde la API al cargar la página
  useEffect(() => {
    cargarDepositos();
  }, []);

  // Función para cargar las categorías desde la API
  const cargarDepositos = () => {
    axios.get('http://api.rodrigomaidana.com:8080/depositos')
      .then(response => {
        setDepositos(response.data);
      })
      .catch(error => {
        console.error('Error al cargar los depositos:', error);
      });
  };

  // Función para crear una nueva categoría
  const crearDeposito = () => {
    axios.post('http://api.rodrigomaidana.com:8080/depositos', {
      nombre,
      direccion,
      contacto
    })
      .then(response => {
        console.log('Deposito creado:', response.data);
        // Recargar las categorías después de la creación exitosa
        cargarDepositos();
      })
      .catch(error => {
        console.error('Error al crear el deposito:', error);
      });
  };

  // Función para eliminar una categoría
  const eliminarDeposito = (id) => {
    axios.delete(`http://api.rodrigomaidana.com:8080/depositos/${id}`)
      .then(() => {
        console.log('Deposito eliminado', id);
        // Recargar las categorías después de la eliminación exitosa
        cargarDepositos();
      })
      .catch(error => {
        console.error('Error al eliminar el deposito:', error);
      });
  };

  // Función para modificar una categoría
  const modificarDeposito = (deposito) => {
    setDepositoSeleccionado(deposito);
    setNuevoNombreDeposito(deposito.nombre);
    setNuevoDireccionDeposito(deposito.direccion);
    setNuevoContactoDeposito(deposito.contacto);
    setMostrarModal(true);
  };

  // Función para guardar los cambios en la categoría
  const guardarCambios = (id) => {

    // Verificar si el nuevo nombre está en blanco
    if (nuevoNombreDeposito.trim() === "") {
      console.error("El nombre del deposito no puede estar en blanco.");
      alert("El nombre no puede estar en blanco.")
      return;
    }
    // Verificar si el nuevo nombre excede el límite de caracteres permitidos
    if (nuevoNombreDeposito.length > 60) {
      console.error("El nombre dedeposito excede el límite de 60 caracteres.");
      alert("Supero el limite de 60 caracteres ")
      return;
    }

    axios.put(`http://api.rodrigomaidana.com:8080/depositos/${id}`,
      {
        "nombre": nuevoNombreDeposito,
        "direccion": nuevoDireccionDeposito,
        "contacto": nuevoContactoDeposito
      }
    )
      .then(() => {
        console.log("Deposito modificado:", id);
        cargarDepositos();
        setMostrarModal(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          console.error("Error: superado el límite de caracteres permitido (60)");
          alert("Supero el limite de 60 caracteres ")
        } else {
          console.error("Error al modificar los depositos:", error);
          alert("Error al modificar")
        }
      });
  };




  // Función para cancelar la edición del deposito
  const cancelarEdicion = () => {
    setMostrarModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className='mb-4 ' style={{ backgroundColor: 'Gray' }}>CRUD de Depositos</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        crearDeposito();
      }}>
        <label htmlFor='nombre' className="form-label">Nombre:</label>
        <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        <br></br>
        <label htmlFor='direccion' className='form-label'>Direccion:</label>
        <input type="text" value={direccion} onChange={(e) => setDireccion(e.target.value)} />
        <br></br>
        <label htmlFor='contacto' className='form-label'>Contacto:</label>
        <input type="text" value={contacto} onChange={(e) => setContacto(e.target.value)} />
        <br></br>
        <button type="submit" className='btn btn-dark'>Crear Depósito</button>
      </form>
      <h2>Depositos</h2>
      <table className='table table-dark table-striped table-bordered'>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Direccion</th>
            <th>Contacto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {depositos.map(deposito => (
            <tr key={deposito.id}>
              <td>{deposito.id}</td>
              <td>{deposito.nombre}</td>
              <td>{deposito.direccion}</td>
              <td>{deposito.contacto}</td>
              <td>
                <button onClick={() => eliminarDeposito(deposito.id)} className='btn btn-danger'>Eliminar</button>
                <button onClick={() => modificarDeposito(deposito)} className='btn btn-primary'>Modificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal para editar categoría */}
      {mostrarModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Deposito</h5>
                <button type="button" className="close" onClick={cancelarEdicion}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor='nombre' className="form-label">Nombre:</label>
                <input type="text" value={nuevoNombreDeposito} onChange={(e) => setNuevoNombreDeposito(e.target.value)} />
                <br></br>
                <label htmlFor='direccion' className='form-label'>Direccion:</label>
                <input type="text" value={nuevoDireccionDeposito} onChange={(e) => setNuevoDireccionDeposito(e.target.value)} />
                <br></br>
                <label htmlFor='contacto' className='form-label'>Contacto:</label>
                <input type="text" value={nuevoContactoDeposito} onChange={(e) => setNuevoContactoDeposito(e.target.value)} />

              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => guardarCambios(depositoSeleccionado.id)}>Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarDepositos;