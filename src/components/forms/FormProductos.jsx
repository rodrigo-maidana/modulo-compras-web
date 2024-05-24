import { useState, useEffect } from "react";
import axios from "axios";
import axiosInstance from "../axiosInstance";
export const FormProductos = ({
  producto,
  actualizarProductos,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    descripcion: "",
    marca: "",
    categoria: "",
  });

  const [marcas, setMarcas] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    if (producto) {
      setFormState({
        descripcion: producto.descripcion,
        marca: producto.marca.id,
        categoria: producto.categoria.id,
      });
    }
  }, [producto]);

  useEffect(() => {
    axiosInstance.get("/marcas").then((response) => {
      setMarcas(response.data);
    });
    axiosInstance.get("/categorias").then((response) => {
      setCategorias(response.data);
    });

  }, []);

  const handleSubmit = () => {
    const { descripcion, marca, categoria } = formState;
    const nuevoProducto = {
      descripcion,
      marca: { id: marca },
      categoria: { id: categoria },
    };

    if (!validar()) {
      return;
    }
    if (isEdit) {
      handleSubmitEdit(nuevoProducto);
    } else {
      handleSubmitNew(nuevoProducto);
    }
  };

  const handleSubmitNew = (nuevoProducto) => {
    axiosInstance
      .post("/productos", nuevoProducto, {

        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        actualizarProductos();
        handleClose();
        setFormState({
          descripcion: "",
          marca: "",
          categoria: "",
        });
      })
      .catch((error) => {
        console.error("Error al crear el producto:", error);
      });
  };

  const handleSubmitEdit = (nuevoProducto) => {
    axiosInstance
      .put(`/productos/${producto.id}`, nuevoProducto, {
        headers: {
          "Content-Type": "application/json",
        },
      })

      .then((response) => {
        actualizarProductos();
        handleClose();
        setFormState({
          descripcion: "",
          marca: "",
          categoria: "",
        });
      })
      .catch((error) => {
        console.error("Error al editar el producto:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const validar = () => {
    const { descripcion, marca, categoria } = formState;
    if (!descripcion || !marca || !categoria) {
      alert("No se aceptan campos en blanco");
      return false;
    }
    return true;
  };

  return (
    <>
      <div className="container p-2">
        <form className="row g-3 mx-auto border border-2 py-3 px-5 rounded col-8">
          <div>
            <h3>Datos del Producto</h3>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="descripcion">
              Descripción
            </label>
            <input
              className="col-6"
              type="text"
              name="descripcion"
              value={formState.descripcion}
              id="descripcion"
              onChange={handleChange}
              placeholder="Ejemplo: Producto X"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="marca">
              Marca
            </label>
            <select
              className="col-6"
              name="marca"
              id="marca"
              value={formState.marca}
              onChange={handleChange}
            >
              <option value="">Seleccione una marca</option>
              {marcas.map((marca) => (
                <option key={marca.id} value={marca.id}>
                  {marca.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="categoria">
              Categoría
            </label>
            <select
              className="col-6"
              name="categoria"
              id="categoria"
              value={formState.categoria}
              onChange={handleChange}
            >
              <option value="">Seleccione una categoría</option>
              {categorias.map((categoria) => (
                <option key={categoria.id} value={categoria.id}>
                  {categoria.nombre}
                </option>
              ))}
            </select>
          </div>
          <div className="text-center">
            <button
              className="btn btn-outline-secondary px-3 mx-1"
              type="button"
              onClick={handleClose}
            >
              Cancelar
            </button>
            <button
              className="btn btn-primary px-3 mx-1"
              type="button"
              onClick={handleSubmit}
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </>
  );
};
