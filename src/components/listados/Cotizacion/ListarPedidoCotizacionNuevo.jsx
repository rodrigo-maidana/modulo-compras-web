import React, { useState, useEffect } from "react";
import axiosInstance from "../../axiosInstance";
import ListarCategoriasDetalles from "./ListarCategoriasDetalles";
import 'bootstrap/dist/css/bootstrap.min.css';
import ListarDetalleTablaCotizacion from "./ListarDetalleTablaCotizacion"
import { useParams } from "react-router-dom";

const ListarPedidoCotizacionNuevo = () => {
    const [detalles, setDetalles] = useState([]);
    const [nroPedido, setNroPedido] = useState("");
    const [categorias, setCategorias] = useState([]);
    const { id } = useParams();

    useEffect(() => {
        const fetchDetalles = async () => {
            try {
                const response = await axiosInstance.get(`/pedidos-compra/detalles/${id}`);
                setDetalles(response.data);
            } catch (error) {
                console.error("Error al cargar los detalles del pedido:", error);
            }
        };

        const fetchCategorias = async () => {
            try {
                const response = await axiosInstance.get(`/pedidos-compra/detalles/${id}`);
                const categorias = response.data.map(item => item.producto.categoria);
                const uniqueCategorias = [...new Set(categorias.map(categoria => categoria.id))].map(
                    id => categorias.find(categoria => categoria.id === id)
                );
                setCategorias(uniqueCategorias);
            } catch (error) {
                console.error("Error al cargar las categorías:", error);
            }
        };

        const fetchPedido = async () => {
            try {
                const response = await axiosInstance.get(`/pedidos-compra/${id}`);
                console.log(response.data); // Verifica la estructura de los datos retornados
                setNroPedido(response.data.nroPedido);
            } catch (error) {
                if (error.response) {
                    // El servidor respondió con un estado fuera del rango 2xx
                    console.error("Error al cargar el número del pedido:", error.response.data);
                } else if (error.request) {
                    // La solicitud fue hecha pero no se recibió respuesta
                    console.error("No se recibió respuesta del servidor:", error.request);
                } else {
                    // Algo pasó al configurar la solicitud que lanzó un error
                    console.error("Error al configurar la solicitud:", error.message);
                }
            }
        };

        if (id) {
            fetchCategorias();
            fetchDetalles();
            fetchPedido();
        }
    }, [id]);

    return (
        <div className="container mt-4">
            <h1 className="mb-4">Cotización del pedido: {nroPedido}</h1>
            <div className="row">
                <div className="col-md-6 mb-4">
                    <h2 className="mb-4">Detalle Productos</h2>
                    <ListarDetalleTablaCotizacion detalles={detalles} />
                </div>
                <div className="col-md-6 mb-4">
                    <h2 className="mb-4">Detalle Categorias</h2>
                    <ListarCategoriasDetalles categorias={categorias} />
                </div>
            </div>
        </div>
    );




};

export default ListarPedidoCotizacionNuevo;
