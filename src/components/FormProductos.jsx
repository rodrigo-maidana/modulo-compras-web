/* import { useState, useEffect } from "react";
import axios from "axios";

export const FormProductos = ({
  producto,
  actualizarproductos,
  isEdit,
  handleClose,
}) => {
  const [formState, setFormState] = useState({
    marca:"",
    producto: "",
    categoria: "",
    descripcion:""
  });

  useEffect(() => {
    console.log("Producto que llego: ", producto);
    if (producto) {
      setFormState({
        marca: producto.marca.nombre,
        producto: producto.nombre,
        categoria: producto.categoria.nombre,
        descripcion: producto.descripcion
      });
    }
  }, [producto]);

  const handleSubmit = () => {
    const { descripcion } = formState;
    const nuevoProdcuto = {
      descripcion: descripcion,

    };
    //console.log(isEdit);
    //isEdit?handleSubmitEdit() : handleSubmitNew()
    if (!validar()) {
      return;
    }
    if (isEdit) {
      console.log(isEdit);
      handleSubmitEdit(nuevoProdcuto);
      //return
    } else {
      console.log(isEdit);
      handleSubmitNew(nuevoProdcuto);
      //return
    }
  };

export const FormProductos = () => {
    const [formState,setFormState] = useState( {
        marca:0,
        producto: "",
        categoria:"",
        descripcion: ""
    })
    const [productos,setproductos] = useState([])
    const [marcas,setMarcas] = useState([])
    
    useEffect(()=>{
        //obtener productos
        axios.get('https://api.rodrigomaidana.com:8080/productos')
        .then(response =>{
            setproductos(response.data);
        })
        .catch(error=>{
            console.error("error:",error)
        });
        //obtener marcas
        axios.get('https://api.rodrigomaidana.com:8080/marcas')
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
                <select className="form-select" name="marca" id="producto" onChange={handleChange} value={formState.marca}>
                    {marcas.map(marca =>(
                        <option key={marca.idMarca} value={marca.idMarca}>{marca.nombre}</option>
                    ))}
                </select>
            </label>
            <label htmlFor="producto"> producto: 
                <select className="form-select" name="producto" onChange={handleChange} value={formState.producto}>
                    {productos.map(producto =>(
                        <option key={producto.idproducto} value={producto.idproducto}>{producto.nombre}</option>
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
}*/
