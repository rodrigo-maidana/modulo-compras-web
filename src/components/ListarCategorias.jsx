import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListarCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [nombre, setNombre] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState([]);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [nuevoNombreCategoria, setNuevoNombreCategoria] = useState('');

  // Función para cargar las categorías desde la API al cargar la página
  useEffect(() => {
    cargarCategorias();
  }, []);

  // Función para cargar las categorías desde la API
  const cargarCategorias = () => {
    axios.get('http://api.rodrigomaidana.com:8080/categorias')
      .then(response => {
        setCategorias(response.data);
      })
      .catch(error => {
        console.error('Error al cargar las categorías:', error);
      });
  };

  // Función para crear una nueva categoría
  const crearCategoria = () => {
    axios.post('http://api.rodrigomaidana.com:8080/categorias', {
      nombre
    })
      .then(response => {
        console.log('Categoría creada:', response.data);
        // Recargar las categorías después de la creación exitosa
        cargarCategorias();
      })
      .catch(error => {
        console.error('Error al crear la categoría:', error);
      });
  };

  // Función para eliminar una categoría
  const eliminarCategoria = (id) => {
    axios.delete(`http://api.rodrigomaidana.com:8080/categorias/${id}`)
      .then(() => {
        console.log('Categoría eliminada', id);
        // Recargar las categorías después de la eliminación exitosa
        cargarCategorias();
      })
      .catch(error => {
        console.error('Error al eliminar la categoría:', error);
      });
  };

  // Función para modificar una categoría
  const modificarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setNuevoNombreCategoria(categoria.nombre);
    setMostrarModal(true);
  };

  // Función para guardar los cambios en la categoría
  const guardarCambios = () => {
    const { id } = categoriaSeleccionada;

    // Verificar si el nuevo nombre está en blanco
    if (nuevoNombreCategoria.trim() === "") {
      console.error("El nombre de la categoría no puede estar en blanco.");
      alert("El nombre no puede estar en blanco.")
      return;
    }
    // Verificar si el nuevo nombre excede el límite de caracteres permitidos
    if (nuevoNombreCategoria.length > 60) {
      console.error("El nombre de la categoría excede el límite de 60 caracteres.");
      alert("Supero el limite de 60 caracteres ")
      return;
    }

    axios.put(`http://api.rodrigomaidana.com:8080/categorias/${id}`, { nombre: nuevoNombreCategoria })
      .then(() => {
        console.log("Categoría modificada:", id);
        cargarCategorias();
        setMostrarModal(false);
      })
      .catch(error => {
        if (error.response && error.response.status === 400) {
          console.error("Error: superado el límite de caracteres permitido (60)");
          alert("Supero el limite de 60 caracteres ")
        } else {
          console.error("Error al modificar la categoría:", error);
          alert("Error al modificar")
        }
      });
  };




  // Función para cancelar la edición de la categoría
  const cancelarEdicion = () => {
    setMostrarModal(false);
  };

  return (
    <div className="container mt-5">
      <h1 className='mb-4 ' style={{ backgroundColor: 'Gray' }}>CRUD de Categorías</h1>
      <form onSubmit={(e) => {
        e.preventDefault();
        crearCategoria();
      }}>
        <label htmlFor='nombre' className="form-label">
          Nombre:
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} />
        </label>
        <button type="submit" className='btn btn-dark'>Crear Categoría</button>
      </form>
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

      {/* Modal para editar categoría */}
      {mostrarModal && (
        <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Editar Categoría</h5>
                <button type="button" className="close" onClick={cancelarEdicion}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                <label htmlFor='nombre' className="form-label">
                  Nombre:
                  <input type="text" value={nuevoNombreCategoria} onChange={(e) => setNuevoNombreCategoria(e.target.value)} className="form-control" />
                </label>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-primary" onClick={() => guardarCambios(categoriaSeleccionada.id)}>Guardar Cambios</button>
                <button type="button" className="btn btn-secondary" onClick={cancelarEdicion}>Cancelar</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ListarCategorias;