// ListarCategorias.jsx
import React, { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { ModalCategoria } from "../modales/ModalCategoria";
import { TablaCategorias } from "../tablas/TablaCategorias";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ListarCategorias = () => {
  const [show, setShow] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShow(false);
    setCategoriaSeleccionada(null);
  };
  const handleShow = () => {
    setShow(true);
    setIsEdit(false);
  };

  const fetchCategorias = () => {
    axiosInstance
      .get("/categorias")
      .then((response) => {
        setCategorias(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para acceder a este recurso.");
        } else {
          console.error("Error: ", error);
        }
      });
  };

  const deleteCategoria = (idCategoria) => {
    axiosInstance
      .delete(`/categorias/${idCategoria}`)
      .then(() => {
        fetchCategorias();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para eliminar este recurso.");
        } else {
          console.error("Error al eliminar el deposito:", error);
        }
      });
  };

  const handleEditarCategoria = (categoria) => {
    setCategoriaSeleccionada(categoria);
    setShow(true);
    setIsEdit(true);
  };

  const handleCrearCategoria = () => {
    setShow(true);
    setIsEdit(false);
    setCategoriaSeleccionada(null); // Resetea el depósito seleccionado para el formulario de creación
  };

  useEffect(() => {
    fetchCategorias();
  }, []);

  return (
    <>
      <TablaCategorias
        categorias={categorias}
        deleteCategoria={deleteCategoria}
        handleEditarCategoria={handleEditarCategoria}
        handleCrearCategoria={handleCrearCategoria}
        faTrash={faTrash}
        faEdit={faEdit}
      />
      <ModalCategoria
        show={show}
        handleClose={handleClose}
        categoria={categoriaSeleccionada}
        isEdit={isEdit}
        actualizarCategorias={fetchCategorias} // Pasar la función para actualizar la lista después de crear o editar
      />
    </>
  );
};
