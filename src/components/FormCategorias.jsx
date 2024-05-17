import { useState, useEffect } from "react";
import axiosInstance from "./axiosInstance";

export const FormCategorias = ({
  categoria,
  actualizarCategorias,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    nombre: "",
  });

  useEffect(() => {
    console.log("Categoria que llego: ", categoria);
    if (categoria) {
      setFormState({
        nombre: categoria.nombre,
      });
    }
  }, [categoria]);

  const handleSubmit = () => {
    const { nombre } = formState;
    const nuevaCategoria = {
      nombre: nombre,
    };
    //console.log(isEdit);
    //isEdit?handleSubmitEdit() : handleSubmitNew()
    if (!validar()) {
      return;
    }
    if (isEdit) {
      console.log(isEdit);
      handleSubmitEdit(nuevaCategoria);
      //return
    } else {
      console.log(isEdit);
      handleSubmitNew(nuevaCategoria);
      //return
    }
  };

  const handleSubmitNew = (nuevaCategoria) => {
    axiosInstance
      .post("https://api.rodrigomaidana.com:8080/categorias", nuevaCategoria)
      .then((response) => {
        console.log(response.data);
        actualizarCategorias();
        handleClose();
        setFormState({
          nombre: "",
        });
      })
      .catch((error) => {
        console.error("Error al crear la categoria:", error);
      });
  };

  const handleSubmitEdit = (nuevaCategoria) => {
    console.log("edita");
    console.log(nuevaCategoria);
    axiosInstance
      .put(
        `https://api.rodrigomaidana.com:8080/categorias/${categoria.id}`,
        nuevaCategoria
      )
      .then((response) => {
        console.log(response.data);
        actualizarCategorias();
        handleClose();
        setFormState({
          nombre: "",
        });
      })
      .catch((error) => {
        console.error("Error al editar la categoria:", error);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const validar = () => {
    const { nombre } = formState;
    if (!nombre) {
      alert("no se aceptan campos en blanco");
      return false;
    }
    return true;
  };
  return (
    <>
      <div className="container p-2">
        <form className="row g-3 mx-auto border border-2 py-3 px-5 rounded col-8">
          <div>
            <h3>Datos de la categoria</h3>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="name">
              Nombre de la categoria
            </label>
            <input
              className="col-6"
              type="text"
              name="nombre"
              value={formState.nombre}
              id="name"
              onChange={handleChange}
              placeholder="Ejemplo: Electrico"
            ></input>
          </div>
          <div className="text-center">
            <button
              className="btn btn-danger px-3 mx-1"
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
