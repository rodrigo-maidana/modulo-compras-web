import { useState, useEffect } from "react";
import axios from "axios";

export const FormDepositos = ({
  deposito,
  actualizarDepositos,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    nombre: "",
    direccion: "",
    contacto:""
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
      //return
    } else {
      console.log(isEdit);
      handleSubmitNew(nuevoDeposito);
      //return
    }
  };

  const handleSubmitNew = (nuevoDeposito) => {
    axios
      .post("https://api.rodrigomaidana.com:8080/depositos", nuevoDeposito)
      .then((response) => {
        console.log(response.data);
        actualizarDepositos();
        handleClose();
        setFormState({
          nombre: "",
          direccion:"",
          contacto:""
        });
      })
      .catch((error) => {
        console.error("Error al crear la deposito:", error);
      });
  };

  const handleSubmitEdit = (nuevoDeposito) => {
    console.log("edita");
    console.log(nuevoDeposito);
    axios
      .put(
        `https://api.rodrigomaidana.com:8080/depositos/${deposito.id}`,
        nuevoDeposito
      )
      .then((response) => {
        console.log(response.data);
        actualizarDepositos();
        handleClose();
        setFormState({
          nombre: "",
          direccion: "",
          contacto: ""
        });
      })
      .catch((error) => {
        console.error("Error al editar la deposito:", error);
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
            <h3>Datos de la deposito</h3>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="name">
              Nombre de la deposito
            </label>
            <input
              className="col-6"
              type="text"
              name="nombre"
              value={formState.nombre}
              id="name"
              onChange={handleChange}
              placeholder="Ejemplo: Suc. Encarnacion 1"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="direccion">
              Direccion del deposito
            </label>
            <input
              className="col-6"
              type="text"
              name="direccion"
              value={formState.direccion}
              id="direccion"
              onChange={handleChange}
              placeholder="Ejemplo: Juan L. Mallorquin"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="contacto">
              Contacto del deposito
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
