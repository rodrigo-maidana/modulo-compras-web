import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import Select from "react-select";

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

  const [categorias, setCategorias] = useState([]);
  const [selectedCategorias, setSelectedCategorias] = useState([]);

  useEffect(() => {
    fetchCategorias();
  }, []);
  //si existe proveedor (querer editar)
  useEffect(() => {
    if (proveedor) {
      setFormState({
        nombre: proveedor.nombre,
        ruc: proveedor.ruc,
        contacto: proveedor.contacto,
        correo: proveedor.correo,
        direccion: proveedor.direccion,
      });
      // Aquí puedes establecer las categorías seleccionadas del proveedor si están disponibles
      setSelectedCategorias(
        proveedor.categorias?.map((cat) => ({
          value: cat.id,
          label: cat.nombre,
        })) || []
      );
    }
  }, [proveedor]);

  const fetchCategorias = async () => {
    try {
      const response = await axiosInstance.get("/categorias");
      const categoriasOptions = response.data.map((cat) => ({
        value: cat.id,
        label: cat.nombre,
      }));
      setCategorias(categoriasOptions);
    } catch (error) {
      console.error("Error al obtener las categorías:", error);
    }
  };

  const handleSubmit = async () => {
    const { nombre, ruc, contacto, correo, direccion } = formState;
    const nuevoProveedor = {
      nombre: nombre,
      ruc: ruc,
      contacto: contacto,
      correo: correo,
      direccion: direccion,
    };

    if (!validar()) {
      return;
    }

    try {
      if (isEdit) {
        await handleSubmitEdit(nuevoProveedor);
      } else {
        await handleSubmitNew(nuevoProveedor);
      }
      actualizarProveedores();
      handleClose();
      setFormState({
        nombre: "",
        ruc: "",
        contacto: "",
        correo: "",
        direccion: "",
      });
      setSelectedCategorias([]);
    } catch (error) {
      console.error("Error al guardar el proveedor:", error);
    }
  };

  const handleSubmitNew = async (nuevoProveedor) => {
    try {
      const response = await axiosInstance.post(
        "https://api.rodrigomaidana.com:8080/api/v1/proveedores",
        nuevoProveedor
      );
      const idProveedorNuevo = response.data.id;

      const categoriaPromises = selectedCategorias.map(async (categoria) => {
        try {
          await axiosInstance.post("/proveedores/categorias", {
            proveedorId: idProveedorNuevo,
            categoriaId: categoria.value,
          });
        } catch (error) {
          console.error(
            `Error al asociar la categoría ${categoria.value} con el proveedor ${idProveedorNuevo}:`,
            error
          );
        }
      });

      await Promise.all(categoriaPromises);
    } catch (error) {
      console.error("Error al crear el nuevo proveedor:", error);
    }
  };

  const handleSubmitEdit = async (nuevoProveedor) => {
    const response = await axiosInstance.put(
      `/proveedores/${proveedor.id}`,
      nuevoProveedor
    );
    return response.data;
  };

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  };

  const handleCategoriaChange = (selectedOptions) => {
    setSelectedCategorias(selectedOptions);
  };

  const validar = () => {
    const { nombre, ruc, contacto, correo, direccion } = formState;
    const rucCheck = /^[0-9-]+$/;
    const contactoCheck = /^[0-9]+$/;
    const correoRegex = /^[\w-]+(\.[\w-]+)*@([\w-]+\.)+[a-zA-Z]{2,7}$/;
    if (!nombre || !ruc || !contacto || !correo || !direccion) {
      alert("no se aceptan campos en blanco");
      return false;
    }
    if (!rucCheck.test(ruc)) {
      alert("ruc solo numeros y guion");
      return false;
    }
    if (!contactoCheck.test(contacto)) {
      alert("contacto solo numeros");
      return false;
    }
    if (!correoRegex.test(correo)) {
      alert("formato de correo no valido");
      return false;
    }
    if (selectedCategorias.length === 0) {
      alert("debe tener al menos una categoria");
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
              type="number"
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
              Dirección:
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
          <div className="col-12-md-6 px-4">
            <label className="col-6 pe-4" htmlFor="categorias">
              Categorías:
            </label>
            <Select
              id="categorias"
              isMulti
              options={categorias}
              value={selectedCategorias}
              onChange={handleCategoriaChange}
              isDisabled={isEdit}
            />
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
