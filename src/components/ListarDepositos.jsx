import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalDeposito } from "./ModalDeposito";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import { TablaDepositos } from "./modales/TablaDepositos"; // Importa TablaDepositos
import axiosInstance from "./axiosInstance";

export const ListarDepositos = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsEdit(false);
  };

  const [depositos, setDepositos] = useState([]);
  const [depositoSeleccionado, setDepositoSeleccionado] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const fetchDepositos = () => {
    axiosInstance
      .get("https://api.rodrigomaidana.com:8080/depositos")
      .then((response) => {
        setDepositos(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const deleteDeposito = (idDeposito) => {
    axiosInstance
      .delete(`https://api.rodrigomaidana.com:8080/depositos/${idDeposito}`)
      .then(() => {
        // Actualizar la lista de depositos después de eliminar
        fetchDepositos();
      })
      .catch((error) => {
        console.log("Error al eliminar el deposito:", error);
      });
  };

  // Función para cargar los depositos desde la API al cargar la página
  useEffect(() => {
    fetchDepositos();
  }, []);

  const handleEditarDeposito = (deposito) => {
    console.log("deposito seleccionado: ", deposito);
    setDepositoSeleccionado(deposito);
    setShow(true);
    setIsEdit(true);
  };

  return (
    <TablaDepositos
      depositos={depositos}
      deleteDeposito={deleteDeposito}
      handleEditarDeposito={handleEditarDeposito}
      faTrash={faTrash}
      faEdit={faEdit}
    />
  );
};
