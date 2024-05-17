// ListarDepositos.jsx
import React, { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import { ModalDeposito } from "../modales/ModalDeposito";
import { TablaDepositos } from "../tablas/TablaDepositos";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

export const ListarDepositos = () => {
  const [show, setShow] = useState(false);
  const [depositos, setDepositos] = useState([]);
  const [depositoSeleccionado, setDepositoSeleccionado] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleClose = () => {
    setShow(false);
    setDepositoSeleccionado(null);
  };
  const handleShow = () => {
    setShow(true);
    setIsEdit(false);
  };

  const fetchDepositos = () => {
    axiosInstance
      .get("/depositos")
      .then((response) => {
        setDepositos(response.data);
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para acceder a este recurso.");
        } else {
          console.error("Error: ", error);
        }
      });
  };

  const deleteDeposito = (idDeposito) => {
    axiosInstance
      .delete(`/depositos/${idDeposito}`)
      .then(() => {
        fetchDepositos();
      })
      .catch((error) => {
        if (error.response && error.response.status === 403) {
          console.error("Error 403: Forbidden. Asegúrate de que tienes permisos para eliminar este recurso.");
        } else {
          console.error("Error al eliminar el deposito:", error);
        }
      });
  };

  const handleEditarDeposito = (deposito) => {
    setDepositoSeleccionado(deposito);
    setShow(true);
    setIsEdit(true);
  };

  const handleCrearDeposito = () => {
    setShow(true);
    setIsEdit(false);
    setDepositoSeleccionado(null); // Resetea el depósito seleccionado para el formulario de creación
  };

  useEffect(() => {
    fetchDepositos();
  }, []);

  return (
    <>
      <TablaDepositos
        depositos={depositos}
        deleteDeposito={deleteDeposito}
        handleEditarDeposito={handleEditarDeposito}
        handleCrearDeposito={handleCrearDeposito}
        faTrash={faTrash}
        faEdit={faEdit}
      />
      <ModalDeposito
        show={show}
        handleClose={handleClose}
        deposito={depositoSeleccionado}
        isEdit={isEdit}
        actualizarDepositos={fetchDepositos} // Pasar la función para actualizar la lista después de crear o editar
      />
    </>
  );
};
