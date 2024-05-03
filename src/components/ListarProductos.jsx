import React, { useState, useEffect } from 'react';
import axios from 'axios';

function ListarDepositos() {
    const [productos, setProductos] = useState([]);


    const [newDescripcion, setNewDescripcion] = useState('');
    const [descripcion, setDescripcion] = useState('');

    const [marcas, setMarcas] = useState([]);
    const [selectedNewMarca, setSelectedNewMarca] = useState('');
    const [selectedMarca, setSelectedMarca] = useState('');

    const [categorias, setCategorias] = useState([]);
    const [selectedNewCategoria, setSelectedNewCategoria] = useState('')
    const [selectedCategoria, setSelectedCategoria] = useState('')

    const [productoSeleccionado, setProductoSeleccionado] = useState(null);
    const [mostrarModal, setMostrarModal] = useState(false);

    // Función para cargar las marcas desde la API
    useEffect(() => {
        cargarProductos();
        cargarMarcas();
        cargarCategorias();
    }, []);

    const cargarMarcas = () => {
        axios.get('http://api.rodrigomaidana.com:8080/marcas')
            .then(response => {
                setMarcas(response.data);
            })
            .catch(error => {
                console.error('Error al cargar las marcas:', error);
            });
    };

    const cargarCategorias = () => {
        axios.get('http://api.rodrigomaidana.com:8080/categorias')
            .then(response => {
                setCategorias(response.data);
            })
            .catch(error => {
                console.error('Error al cargar las categorías:', error);
            });
    };

    // Función para cargar las categorías desde la API
    const cargarProductos = () => {
        axios.get('http://api.rodrigomaidana.com:8080/productos')
            .then(response => {
                setProductos(response.data);
            })
            .catch(error => {
                console.error('Error al cargar los productos:', error);
            });
    };

    // Función para crear una nuevo producto
    const crearProducto = () => {
        console.log(selectedNewMarca);
        console.log(selectedNewCategoria);
        axios.post('http://api.rodrigomaidana.com:8080/productos', {
            "marca": {
                "id": selectedNewMarca,
            },
            "categoria": {
                "id": selectedNewCategoria,
            },
            "descripcion": newDescripcion
        })
            .then(response => {
                console.log('Producto creado:', response.data);
                cargarProductos();
                setNewDescripcion('');
                setSelectedNewMarca('');
                setSelectedNewCategoria('');
            })
            .catch(error => {
                console.error('Error al crear el producto:', error);
            });
    };

    // Función para eliminar una categoría
    const eliminarProducto = (id) => {
        axios.delete(`http://api.rodrigomaidana.com:8080/productos/${id}`)
            .then(() => {
                console.log('Producto eliminado', id);
                // Recargar las categorías después de la eliminación exitosa
                cargarProductos();
            })
            .catch(error => {
                console.error('Error al eliminar el producto:', error);
            });
    };

    // Función para mostrar el modal de edición de producto
    const modificarProducto = (producto) => {
        setProductoSeleccionado(producto);
        setSelectedCategoria(producto.categoria.id);
        setSelectedMarca(producto.marca.id);
        setDescripcion(producto.descripcion)
        setMostrarModal(true);
    };

    // Función para guardar los cambios en el producto
    const guardarCambios = (id) => {

        // Verificar si el nuevo nombre está en blanco
        if (descripcion.trim() === "") {
            console.error("El nombre del producto no puede estar en blanco.");
            alert("El nombre no puede estar en blanco.");
            return;
        }

        // Verificar si el nuevo nombre excede el límite de caracteres permitidos
        if (descripcion.length > 200) {
            console.error("El nombre del producto excede el límite de 200 caracteres.");
            alert("El nombre no puede superar los 200 caracteres.");
            return;
        }

        !selectedCategoria ? alert("Seleccione una Categoria") :
            !selectedMarca ? alert("Seleccione una Marca") :

                axios.put(`http://api.rodrigomaidana.com:8080/productos/${id}`,
                    {
                        "marca": {
                            "id": selectedMarca,
                        },
                        "categoria": {
                            "id": selectedCategoria,
                        },
                        "descripcion": descripcion
                    })
                    .then(() => {
                        console.log("Producto modificado:", id);
                        cargarProductos();
                        setMostrarModal(false);
                    })
                    .catch(error => {
                        if (error.response && error.response.status === 400) {
                            console.error("Error: superado el límite de caracteres permitido (200)");
                            alert("El nombre no puede superar los 200 caracteres.");
                        } else {
                            console.error("Error al modificar el producto:", error);
                            alert("Error al modificar el producto.");
                        }
                    });
    };

    // Función para cancelar la edición del producto
    const cancelarEdicion = () => {
        setMostrarModal(false);
        setSelectedMarca([]);
        setSelectedCategoria([]);
        setDescripcion('');
    };


    return (
        <div className="container mt-5">
            <h1 className='mb-4' style={{ backgroundColor: 'Gray' }}>CRUD de Productos</h1>
            <form onSubmit={(e) => {
                e.preventDefault();
                crearProducto();
            }}>
                <div className="mb-3">
                    <label htmlFor='marcas' className="form-label">Marca:</label>
                    <select id='marcas' value={selectedNewMarca} onChange={(e) => setSelectedNewMarca(e.target.value)}>
                        <option value="">Seleccione una Marca</option>
                        {marcas.map((marca) => (
                            <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor='categorias' className="form-label">Categorías:</label>
                    <select id='categorias' value={selectedNewCategoria} onChange={(e) => setSelectedNewCategoria(e.target.value)}>
                        <option value="">Seleccione una Categoría</option>
                        {categorias.map((categoria) => (
                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                        ))}
                    </select>
                </div>
                <div className="mb-3">
                    <label htmlFor='descripcion' className="form-label">Descripción:</label>
                    <input type="text" value={newDescripcion} onChange={(e) => setNewDescripcion(e.target.value)} />
                </div>
                <button type="submit" className='btn btn-dark'>Crear Producto</button>
            </form>
            <h2>Productos</h2>
            <table className='table table-dark table-striped table-bordered'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Marca</th>
                        <th>Categoría</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {productos.map(producto => (
                        <tr key={producto.id}>
                            <td>{producto.id}</td>
                            <td>{producto.marca ? producto.marca.nombre : "a"}</td>
                            <td>{producto.categoria ? producto.categoria.nombre : "A"}</td>
                            <td>{producto.descripcion}</td>
                            <td>
                                <button onClick={() => eliminarProducto(producto.id)} className='btn btn-danger'>Eliminar</button>
                                <button onClick={() => modificarProducto(producto)} className='btn btn-primary'>Modificar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {/* Modal para editar producto */}
            {mostrarModal && (
                <div className="modal" tabIndex="-1" role="dialog" style={{ display: 'block' }}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Editar Producto</h5>
                                <button type="button" className="close" onClick={cancelarEdicion}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <div className="mb-3">
                                    <label htmlFor='marcas' className="form-label">Marcas:</label>
                                    <select id='marcas' value={selectedMarca} onChange={(e) => setSelectedMarca(e.target.value)}>
                                        <option value="">Seleccione una Marca</option>
                                        {marcas.map((marca) => (
                                            <option key={marca.id} value={marca.id}>{marca.nombre}</option>
                                        ))}
                                    </select>
                                    <br></br>
                                    <label htmlFor='categorias' className="form-label">Categorías:</label>
                                    <select id='categorias' value={selectedCategoria} onChange={(e) => setSelectedCategoria(e.target.value)}>
                                        <option value="">Seleccione una Categoría</option>
                                        {categorias.map((categoria) => (
                                            <option key={categoria.id} value={categoria.id}>{categoria.nombre}</option>
                                        ))}
                                    </select>
                                    <br></br>
                                    <label htmlFor='nombre' className="form-label">Descripcion:</label>
                                    <input type="text" value={descripcion} onChange={(e) => setDescripcion(e.target.value)} />
                                </div>
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-primary" onClick={() => guardarCambios(productoSeleccionado.id)}>Guardar Cambios</button>
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