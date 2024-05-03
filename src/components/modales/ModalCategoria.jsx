import React from "react";
import { FormCategorias } from "../FormCategorias";
export const ModalCategoria = ({
  show,
  handleClose,
  actualizarCategoria,
  categoria,
  isEdit,
}) => {
  return (
    <div>
      <Modal.Dialog show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal title</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Form categoria</p>
          <FormCategorias
            categoria={categoria}
            actualizarCategoria={actualizarCategoria}
            isEdit={isEdit}
            handleClose={handleClose}
          />
        </Modal.Body>
      </Modal.Dialog>
    </div>
  );
};
