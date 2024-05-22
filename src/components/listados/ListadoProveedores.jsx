import React, { useEffect, useState } from "react";
import { ModalProveedor } from "../modales/ModalProveedor";
import axiosInstance from "../axiosInstance";
import { TablaProveedores } from "../tablas/TablaProveedores";
export const ListadoProveedores = () => {
  //state para el modal
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
    console.log("llego al handleCrearProveedor");
    setShow(true);
    setIsEdit(false);
    setProveedorSeleccionado(null);
  };
  const fetchProveedores = () => {
    axiosInstance
      .get("/proveedores")
      .then((response) => {
        setProveedores(response.data);
      })
      .catch((error) => {
        console.log("error: ", error);
      });
  };
  const deleteProveedor = (idProveedor) => {
    axiosInstance
      .delete(`/proveedores/${idProveedor}`)
      .then(() => {
        // Actualizar la lista de proveedores después de eliminar
        fetchProveedores();
      })
      .catch((error) => {
        console.log("Error al eliminar el proveedor:", error);
      });
  };

  useEffect(() => {
    // Cargar la lista de proveedores al cargar el componente
    fetchProveedores();
  }, []);
  const actualizarProveedores = () => {
    // Actualizar la lista de proveedores después de agregar uno nuevo
    console.log("llego");
    fetchProveedores();
  };
  const handleEditarProveedor = (proveedor) => {
    console.log("proveedor seleccionado: ", proveedor);
    setProveedorSeleccionado(proveedor);
    setShow(true);
    setIsEdit(true);
  };

  return (
    <>
      {/* 
      <div className="containter">
        <div className="p-1 ps-4">
          <h1>Listado de proveedores</h1>
        </div>
        <div className="col-12 p-3 ">
          <table className="table table-secondary col-8">
            <thead>
              <tr>
                <th>Id</th>
                <th>Nombre</th>
                <th>RUC</th>
                <th>Contacto</th>
                <th>Correo</th>
                <th>Direccion</th>
                <th>Opciones</th>
              </tr>
            </thead>
            <tbody>
              {proveedores.map((proveedor) => (
                <tr className="table-secondary" key={proveedor.id}>
                  <td>{proveedor.id}</td>
                  <td>{proveedor.nombre}</td>
                  <td>{proveedor.ruc}</td>
                  <td>{proveedor.contacto}</td>
                  <td>{proveedor.correo}</td>
                  <td>{proveedor.direccion}</td>
                  <td>
                    <input
                      type="submit"
                      className="btn btn-info me-2"
                      onClick={() => handleEditarProveedor(proveedor)}
                      proveedor={proveedorSeleccionado}
                      value="Editar"
                    />
                    <button
                      className="btn btn-danger"
                      onClick={() => deleteProveedor(proveedor.id)}
                    >
                      Eliminar
                    </button>
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
              Crear proveedor
            </button>
          </div>
        </div>
      </div>
      */}
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
