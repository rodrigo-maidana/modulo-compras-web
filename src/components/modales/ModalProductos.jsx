import React from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { FormProductos } from "../forms/FormProductos";

export const ModalProducto = ({
  show,
  handleClose,
  actualizarProductos,
  producto,
  isEdit,
}) => {
  return (
    <>
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header>
          <Modal.Title className="p-1">
            <h1>{isEdit ? "Editar producto" : "Crear producto"}</h1>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FormProductos
            producto={producto}
            actualizarProductos={actualizarProductos}
            isEdit={isEdit}
            handleClose={handleClose}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
