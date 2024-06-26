import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import App from "../../App";
import { FormDepositos } from "../forms/FormDepositos";
//props para mostrar el modal
export const ModalDeposito = ({
  show,
  handleClose,
  actualizarDepositos,
  deposito,
  isEdit,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header>
          <Modal.Title className="mt-2 ms-2">
            {isEdit ? "" : "Crear deposito"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormDepositos
            deposito={deposito}
            actualizarDepositos={actualizarDepositos}
            isEdit={isEdit}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal>
    </>
  );
};
