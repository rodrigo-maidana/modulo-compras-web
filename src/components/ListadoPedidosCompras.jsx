import React, { useEffect, useState } from 'react'
import axios from 'axios'
export const ListadoPedidosCompras = () => {
    const [pedidoCompras ,setPedidoCompras] = useState([]);

    useEffect(()=>{
        //obtener pedidos
        axios.get('http://52.186.168.213:8080/pedidoscompra')
        .then((response)=>{
            setPedidoCompras(response.data)
            console.log(response.data);
        })
        .catch((error)=>{
            console.log("el error es: ",error)
        })
    },[])

    const formatearFecha = (fecha) => {
        // Crear un objeto Date a partir de la fecha de emisión
        const fechaEmision = new Date(fecha);
        // Obtener los componentes de la fecha (año, mes y día)
        const año = fechaEmision.getFullYear();
        const mes = fechaEmision.getMonth() + 1; // Sumar 1 porque los meses van de 0 a 11
        const dia = fechaEmision.getDate();
        // Formatear la fecha en el formato deseado
        return `${año}-${dia < 10 ? '0' + dia : dia}-${mes < 10 ? '0' + mes : mes}`;
    };

  return (
    <div className='containter'>
        <div className='p-1 ps-4'>
            <h1>Listado de proveedores</h1>
        </div>
        <div className='col-12 p-3 px-5'>
        <table className='table table-secondary col-6'>
            <thead>
                <tr>
                    <th>Id</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Opciones</th>
                </tr>
            </thead>
            <tbody>
                {pedidoCompras.map((pedido)=>(
                    <tr className='table-secondary' key={pedido.id}>
                        <td>{pedido.id}</td>
                        <td>{formatearFecha(pedido.fechaEmision)}</td>
                        <td>{pedido.estado}</td>
                        <td>
                            <button className='btn btn-info m-2'>Ver</button>
                            <button className='btn btn-warning m-2'>Editar</button>
                            <button className='btn btn-danger m-2'>Eliminar</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
        </div>
    </div>
  )
}
