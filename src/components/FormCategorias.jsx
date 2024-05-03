import React, { useEffect } from "react";

export const FormCategorias = ({
  categoria,
  actualizarCategoria,
  isEdit,
  handleClose,
}) => {
  /*categoria es el objeto 
    actualizarCategoria es el fetch de get
    isEdit state para saber si se edita o no
    handleClose para cerrar el modal en el boton cancelar
    */
  const [nombre, setNombre] = useState("");
  useEffect(() => {
    setNombre(nombre);
  }, [nombre]);

  const handleSubmit = () => {
    //si es edicion funcion para editar (put) si no post
    if (isEdit) {
      handleSubmitEdit(categoria);
    } else {
      handleSubmitNew(categoria);
    }
  };

  const handleSubmitNew = (categoria) => {
    axios
      .post("https://api.rodrigomaidana.com:8080/categorias", categoria)
      .then((response) => {
        actualizarCategoria();
        handleClose();
        setNombre("");
      })
      .catch((error) => console.log("error: ", error));
  };

  const handleSubmitEdit = (categoria) => {
    axios
      .put(
        `https://api.rodrigomaidana.com:8080/categorias/${categoria.id}`,
        categoria
      )
      .then((response) => {
        actualizarCategoria();
        handleClose();
        setNombre("");
      })
      .catch((error) => console.log("error al editar: ", error));
  };

  const handleChange = (e) => {
    const { value } = e.target;
    setNombre(nombre, value);
  };
  return (
    <>
      <form>
        <div>
          <lable>Nombre</lable>
          <input
            type="text"
            name="nombre"
            value={nombre}
            onChange={handleChange}
          ></input>
        </div>
      </form>
    </>
  );
};
