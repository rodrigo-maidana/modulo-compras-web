import React, { useEffect } from 'react'
import { useState } from 'react'
import axios from 'axios'
export const FormProductos = () => {
    const [formState,setFormState] = useState( {
        marca:0,
        categoria: "",
        descripcion: ""
    })
    const [categorias,setCategorias] = useState([])
    const [marcas,setMarcas] = useState([])
    
    useEffect(()=>{
        //obtener categorias
        axios.get('http://52.186.168.213:8080/categorias')
        .then(response =>{
            setCategorias(response.data);
        })
        .catch(error=>{
            console.error("error:",error)
        });
        //obtener marcas
        axios.get('http://52.186.168.213:8080/marcas')
        .then(response =>{
            setMarcas(response.data)
        })
        .catch(error=>{
            console.error("error: ", error)
        })
    },[])

    const handleSubmit = (e)=>{
        e.preventDefault()
        //validacion de descripcion
        if(formState.descripcion.length > 60 || formState.descripcion.length ===0){
            alert("Descripcion no puede tener mas de 60 caracteres o vacio")
            //console.log("llego");
        }
        //mandar al api por axios
    }
    const handleChange = (e)=>{
        e.preventDefault()
        const {name, value} = e.target
        setFormState({...formState,
            [name]:value})
    }
  return (
    <>
    <div className="container">
    <h1 className='p-4 text-center'>Cargar producto</h1>
        <form className="row g-3 mx-auto border border-2 py-3 px-5 rounded col-8">
            <div><h2>Datos del producto</h2></div>
            <label htmlFor="marca"> Marca: 
                <select className="form-select" name="marca" id="categoria" onChange={handleChange} value={formState.marca}>
                    {marcas.map(marca =>(
                        <option key={marca.idMarca} value={marca.idMarca}>{marca.nombre}</option>
                    ))}
                </select>
            </label>
            <label htmlFor="categoria"> Categoria: 
                <select className="form-select" name="categoria" onChange={handleChange} value={formState.categoria}>
                    {categorias.map(categoria =>(
                        <option key={categoria.idCategoria} value={categoria.idCategoria}>{categoria.nombre}</option>
                    ))}
                </select>
            </label>
            <label className="col-12 pe-4" htmlFor="descripcion">Descripcion: 
                <input className="col-12" type="text" name="descripcion" id="descripcion" onChange={handleChange} />
            </label>
            <div className='text-center'>
                <button type="button" className='m-2 btn btn-danger'>Cancelar</button>
                <button type="submit" className="m-2 btn btn-primary"onClick={handleSubmit}> Cargar</button>
            </div>

        </form>
        </div>
    </>
  )
}
