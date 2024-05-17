import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";

export const FormDepositos = ({
  deposito,
  actualizarDepositos,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    nombre: "",
    direccion: "",
    contacto: ""
  });

  useEffect(() => {
    console.log("deposito que llego: ", deposito);
    if (deposito) {
      setFormState({
        nombre: deposito.nombre,
        direccion: deposito.direccion,
        contacto: deposito.contacto
      });
    }
  }, [deposito]);

  const handleSubmit = () => {
    const { nombre, direccion, contacto } = formState;
    const nuevoDeposito = {
      nombre: nombre,
      direccion: direccion,
      contacto: contacto
    };
    if (!validar()) {
      return;
    }
    if (isEdit) {
      console.log(isEdit);
      handleSubmitEdit(nuevoDeposito);
    } else {
      console.log(isEdit);
      handleSubmitNew(nuevoDeposito);
    }
  };

  const handleSubmitNew = (nuevoDeposito) => {
    axiosInstance
      .post("/depositos", nuevoDeposito)
      .then((response) => {
        console.log(response.data);
        actualizarDepositos(); // Actualizar la lista de depósitos después de crear uno nuevo
        handleClose();
        setFormState({
          nombre: "",
          direccion: "",
          contacto: ""
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para crear este recurso.");
        } else {
          console.error("Error al crear el depósito:", error);
        }
      });
  };

  const handleSubmitEdit = (nuevoDeposito) => {
    axiosInstance
      .put(`/depositos/${deposito.id}`, nuevoDeposito)
      .then((response) => {
        console.log(response.data);
        actualizarDepositos(); // Actualizar la lista de depósitos después de editar uno
        handleClose();
        setFormState({
          nombre: "",
          direccion: "",
          contacto: ""
        });
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para editar este recurso.");
        } else {
          console.error("Error al editar el depósito:", error);
        }
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
            <h3>Datos de la depósito</h3>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="name">
              Nombre de la depósito
            </label>
            <input
              className="col-6"
              type="text"
              name="nombre"
              value={formState.nombre}
              id="name"
              onChange={handleChange}
              placeholder="Ejemplo: Suc. Encarnación 1"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="direccion">
              Dirección de la depósito
            </label>
            <input
              className="col-6"
              type="text"
              name="direccion"
              value={formState.direccion}
              id="direccion"
              onChange={handleChange}
              placeholder="Ejemplo: Juan L. Mallorquín"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="contacto">
              Contacto de la depósito
            </label>
            <input
              className="col-6"
              type="text"
              name="contacto"
              value={formState.contacto}
              id="contacto"
              onChange={handleChange}
              placeholder="Ejemplo: Jorge Daniel Figueredo Amarilla"
            ></input>
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
