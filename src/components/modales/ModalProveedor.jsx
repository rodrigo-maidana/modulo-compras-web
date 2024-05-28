import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import App from "../../App";
import { FormProveedores } from "../forms/FormProveedores";
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
          <Modal.Title className="mt-2 ms-2">
            {!isEdit ? <h2>Crear proveedor</h2> : <></>}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
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
