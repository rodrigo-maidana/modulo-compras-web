import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import App from "../App";
import { FormCategorias } from "./FormCategorias";
//props para mostrar el modal
export const ModalCategoria = ({
  show,
  handleClose,
  actualizarCategorias,
  categoria,
  isEdit,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header>
          <Modal.Title className="p-1">
            {" "}
            <h1>Crear categoria</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*
          <App
            categoria={categoria}
            actualizarCategorias={actualizarCategorias}
            isEdit={isEdit}
            handleClose={handleClose}
          />
  */}
          <FormCategorias
            categoria={categoria}
            actualizarCategorias={actualizarCategorias}
            isEdit={isEdit}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
