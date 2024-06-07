import React, { useState } from "react";
import { TablaOrdenesPago } from "../tablas/TablaOrdenesPago";
import ModalDetalleOrdenPago from "../modales/ModalDetalleOrdenPago";

export const ListadoOrdenPago = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedOrdenPagoId, setSelectedOrdenPagoId] = useState(null);

  const handleOpenModal = (ordenPagoId) => {
    setSelectedOrdenPagoId(ordenPagoId);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedOrdenPagoId(null);
  };

  return (
    <>
      <TablaOrdenesPago handleOpenModal={handleOpenModal} />
      <ModalDetalleOrdenPago
        show={showModal}
        handleClose={handleCloseModal}
        ordenPagoId={selectedOrdenPagoId}
      />
    </>
  );
};

export default ListadoOrdenPago;
