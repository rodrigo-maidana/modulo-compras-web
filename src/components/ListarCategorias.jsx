import React, { useEffect, useState } from "react";
import axios from "axios";
import { ModalCategoria } from "./ModalCategoria";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import axiosInstance from "./axiosInstance";

export const ListarCategorias = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsEdit(false);
  };

  const [categorias, setcategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchCategorias = () => {
    axiosInstance
      .get("/categorias")
      .then((response) => {
        setcategorias(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const deleteCategoria = (idCategoria) => {
    axiosInstance
      .delete(`/categorias/${idCategoria}`)
      .then(() => {
        // Actualizar la lista de categorias después de eliminar
        fetchCategorias();
      })
      .catch((error) => {
        console.log("Error al eliminar la categoria:", error);
      });
  };
  // Función para cargar las categorías desde la API al cargar la página
  useEffect(() => {
    fetchCategorias();
  }, []);

  const actualizarCategorias = () => {
    // Actualizar la lista de categorias después de agregar uno nuevo
    console.log("llego");
    fetchCategorias();
  };

  const handleEditarCategoria = (categoria) => {
    console.log("categoria seleccionado: ", categoria);
    setCategoriaSeleccionada(categoria);
    setShow(true);
    setIsEdit(true);
  };

  const iconoEstilo = {
    marginRight: "10px", // Ajusta el valor según sea necesario
  };

  return (
    <>
      <div className="containter">
        <div className="p-1 ps-4">
          <h1>Listado de categorias</h1>
        </div>
        <div className="col-12 p-3 ">
          <table className="table table-secondary col-8">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {categorias.map((categorias) => (
                <tr className="table-secondary" key={categorias.id}>
                  <td>{categorias.id}</td>
                  <td>{categorias.nombre}</td>
                  <td>
                    <span
                      style={iconoEstilo}
                      onClick={() => handleEditarCategoria(categorias)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span onClick={() => deleteCategoria(categorias.id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="text-end">
            <button
              type="submit"
              className="btn btn-primary m-2"
              onClick={handleShow}
            >
              {" "}
              Crear categoria
            </button>
          </div>
        </div>
      </div>
      <ModalCategoria
        show={show}
        handleClose={() => {
          setShow(false);
          setCategoriaSeleccionada(null);
        }}
        actualizarCategorias={actualizarCategorias}
        categoria={categoriaSeleccionada}
        isEdit={isEdit}
      />
    </>
  );
};
