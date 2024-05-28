import React, { useEffect, useState } from "react";
import { ModalProveedor } from "../modales/ModalProveedor";
import axiosInstance from "../axiosInstance";
import { TablaProveedores } from "../tablas/TablaProveedores";

export const ListadoProveedores = () => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => {
    setShow(true);
    setIsEdit(false);
  };
  const [proveedores, setProveedores] = useState([]);
  const [proveedorSeleccionado, setProveedorSeleccionado] = useState(null);
  const [isEdit, setIsEdit] = useState(false);

  const handleCrearProveedor = () => {
    setShow(true);
    setIsEdit(false);
    setProveedorSeleccionado(null);
  };
  //obtener categorias por id del proveedor
  const fetchCategorias = async (idProveedor) => {
    try {
      const response = await axiosInstance.get(
        `/proveedores/${idProveedor}/categorias`
      );
      return response.data;
    } catch (error) {
      console.error(
        `Error al obtener categorías para el proveedor ${idProveedor}:`,
        error
      );
      return [];
    }
  };

  const fetchProveedores = async () => {
    try {
      const response = await axiosInstance.get("/proveedores");
      const proveedoresConCategorias = await Promise.all(
        response.data.map(async (proveedor) => {
          const categorias = await fetchCategorias(proveedor.id);
          return { ...proveedor, categorias };
        })
      );
      setProveedores(proveedoresConCategorias);
    } catch (error) {
      console.error("Error al obtener proveedores:", error);
    }
  };

  const deleteProveedor = (idProveedor) => {
    axiosInstance
      .delete(`/proveedores/${idProveedor}`)
      .then(() => {
        fetchProveedores();
      })
      .catch((error) => {
        console.log("Error al eliminar el proveedor:", error);
      });
  };

  useEffect(() => {
    fetchProveedores();
  }, []);

  const actualizarProveedores = () => {
    fetchProveedores();
  };

  const handleEditarProveedor = (proveedor) => {
    setProveedorSeleccionado(proveedor);
    setShow(true);
    setIsEdit(true);
  };

  return (
    <>
      <TablaProveedores
        proveedores={proveedores}
        deleteProveedor={deleteProveedor}
        handleEditarProveedor={handleEditarProveedor}
        handleCrearProveedor={handleCrearProveedor}
      />
      <ModalProveedor
        show={show}
        handleClose={() => {
          setShow(false);
          setProveedorSeleccionado(null);
        }}
        actualizarProveedores={actualizarProveedores}
        proveedor={proveedorSeleccionado}
        isEdit={isEdit}
      />
    </>
  );
};
