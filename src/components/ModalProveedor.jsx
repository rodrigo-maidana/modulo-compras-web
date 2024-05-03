import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import App from "../App";
import { FormProveedores } from "./FormProveedores";
//props para mostrar el modal
export const ModalProveedor = ({
  show,
  handleClose,
  actualizarProveedores,
  proveedor,
  isEdit,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header>
          <Modal.Title className="p-1">
            {" "}
            <h1>Crear proveedor</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/*
          <App
            proveedor={proveedor}
            actualizarProveedores={actualizarProveedores}
            isEdit={isEdit}
            handleClose={handleClose}
          />
  */}
          <FormProveedores
            proveedor={proveedor}
            actualizarProveedores={actualizarProveedores}
            isEdit={isEdit}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
