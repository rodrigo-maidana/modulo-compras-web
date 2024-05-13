import React, { useState, useEffect } from "react";
import axios from "axios";
import { ModalDeposito } from "./ModalDeposito";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";

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
    axios
      .get("https://api.rodrigomaidana.com:8080/depositos")
      .then((response) => {
        setDepositos(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };

  const deleteDeposito = (idDeposito) => {
    axios
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

  const actualizarDepositos = () => {
    // Actualizar la lista de depositos después de agregar uno nuevo
    console.log("llego");
    fetchDepositos();
  };

  const handleEditarDeposito = (deposito) => {
    console.log("deposito seleccionado: ", deposito);
    setDepositoSeleccionado(deposito);
    setShow(true);
    setIsEdit(true);
  };

  const iconoEstilo = {
    marginRight: '10px' // Ajusta el valor según sea necesario
  };


  return (
    <>
      <div className="containter">
        <div className="p-1 ps-4">
          <h1>Listado de depositos</h1>
        </div>
        <div className="col-12 p-3 ">
          <table className="table table-secondary col-8">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>Direccion</th>
                <th>Contacto</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {depositos.map((depositos) => (
                <tr className="table-secondary" key={depositos.id}>
                  <td>{depositos.id}</td>
                  <td>{depositos.nombre}</td>
                  <td>{depositos.direccion}</td>
                  <td>{depositos.contacto}</td>
                  <td>
                  <span
                      style={iconoEstilo}
                      onClick={() => handleEditarDeposito(depositos)}
                    >
                      <FontAwesomeIcon icon={faEdit} />
                    </span>
                    <span onClick={() => deleteDeposito(depositos.id)}>
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
              Crear deposito
            </button>
          </div>
        </div>
      </div>
      <ModalDeposito
        show={show}
        handleClose={() => {
          setShow(false);
          setDepositoSeleccionado(null);
        }}
        actualizarDepositos={actualizarDepositos}
        deposito={depositoSeleccionado}
        isEdit={isEdit}
      />
    </>
  );
};
