import { useState, useEffect } from "react";
import axios from "axios";

export const FormProveedores = ({
  proveedor,
  actualizarProveedores,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    nombre: "",
    ruc: "",
    contacto: "",
    correo: "",
    direccion: "",
  });

  useEffect(() => {
    console.log("proveedor que llego: ", proveedor);
    if (proveedor) {
      setFormState({
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        contacto: proveedor.contacto,
        correo: proveedor.correo,
        direccion: proveedor.direccion,
      });
    }
  }, [proveedor]);
  const handleSubmit = () => {
    const { nombre, ruc, contacto, correo, direccion } = formState;
    const nuevoProveedor = {
      nombre: nombre,
      ruc: ruc,
      contacto: contacto,
      correo: correo,
      direccion: direccion,
    };
    //console.log(isEdit);
    //isEdit?handleSubmitEdit() : handleSubmitNew()
    if (!validar()) {
      return;
    }
    if (isEdit) {
      console.log(isEdit);
      handleSubmitEdit(nuevoProveedor);
      //return
    } else {
      console.log(isEdit);
      handleSubmitNew(nuevoProveedor);
      //return
    }
  };
  const handleSubmitNew = (nuevoProveedor) => {
    axios
      .post("http://52.186.168.213:8080/proveedores", nuevoProveedor)
      .then((response) => {
        console.log(response.data);
        actualizarProveedores();
        handleClose();
        setFormState({
          nombre: "",
          ruc: "",
          contacto: "",
          correo: "",
          direccion: "",
        });
      })
      .catch((error) => {
        console.error("Error al crear el proveedor:", error);
      });
  };
  const handleSubmitEdit = (nuevoProveedor) => {
    console.log("edita");
    console.log(nuevoProveedor);
    axios
      .put(
        `http://52.186.168.213:8080/proveedores/${proveedor.id}`,
        nuevoProveedor
      )
      .then((response) => {
        console.log(response.data);
        actualizarProveedores();
        handleClose();
        setFormState({
          nombre: "",
          ruc: "",
          contacto: "",
          correo: "",
          direccion: "",
        });
      })
      .catch((error) => {
        console.error("Error al editar el proveedor:", error);
      });
  };
  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const validar = () => {
    const { nombre, ruc, contacto, correo, direccion } = formState;
    const rucCheck = /^[0-9-]+$/;
    if (!nombre || !ruc || !contacto || !correo || !direccion) {
      alert("no se aceptan campos en blanco");
      return false;
    }
    if (!rucCheck.test(ruc)) {
      alert("ruc solo numeros y guion");
      return false;
    }
    const correoRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!correoRegex.test(correo)) {
      alert("formato de correo no valido");
      return false;
    }
    return true;
  };
  return (
    <>
      <div className="container p-2">
        <form className="row g-3 mx-auto border border-2 py-3 px-5 rounded col-8">
          <div>
            <h3>Datos del proveedor</h3>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="name">
              Nombre del proveedor
            </label>
            <input
              className="col-6"
              type="text"
              name="nombre"
              value={formState.nombre}
              id="name"
              onChange={handleChange}
              placeholder="Ejemplo: Empresa S.A"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="ruc">
              RUC:
            </label>
            <input
              className="col-6"
              type="text"
              name="ruc"
              id="ruc"
              placeholder="ejemplo: 5476982-5"
              value={formState.ruc}
              onChange={handleChange}
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="contactoProveedor">
              Contacto:
            </label>
            <input
              className="col-6"
              type="text"
              name="contacto"
              value={formState.contacto}
              id="contactoProveedor"
              onChange={handleChange}
              placeholder="ejemplo: Juan Gonzalez"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="correoProveedor">
              Correo:
            </label>
            <input
              className="col-6"
              type="email"
              name="correo"
              value={formState.correo}
              id="correoProveedor"
              onChange={handleChange}
              placeholder="name@example.com"
            ></input>
          </div>
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="direccionProveedor">
              Direccion:
            </label>
            <input
              className="col-6"
              type="text"
              name="direccion"
              value={formState.direccion}
              id="direccionProveedor"
              onChange={handleChange}
              placeholder="ejemplo: calle 1 c/ calle2"
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
