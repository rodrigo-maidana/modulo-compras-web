import { useState, useEffect } from "react";
import axiosInstance from "../axiosInstance";
import "../styles.css";

export const FormMarcas = ({
    marca,
    actualizarMarcas,
    isEdit,
    handleClose,
}) => {
    const [formState, setFormState] = useState({
        nombre: "",
    });

    useEffect(() => {
        if (marca) {
            setFormState({
                nombre: marca.nombre,
            });
        }
    }, [marca]);

    const handleSubmit = () => {
        const { nombre } = formState;
        const nuevaMarca = {
            nombre: nombre,
        };

        if (!validar()) {
            return;
        }
        if (isEdit) {
            handleSubmitEdit(nuevaMarca);
        } else {
            handleSubmitNew(nuevaMarca);
        }
    };

    const handleSubmitNew = (nuevaMarca) => {
        axiosInstance
            .post("/marcas", nuevaMarca)
            .then((response) => {
                actualizarMarcas();
                handleClose();
                setFormState({
                    nombre: "",
                });
            })
            .catch((error) => {
                console.error("Error al crear la marca:", error);
            });
    };

    const handleSubmitEdit = (nuevaMarca) => {
        axiosInstance
            .put(`/marcas/${marca.id}`, nuevaMarca)
            .then((response) => {
                actualizarMarcas();
                handleClose();
                setFormState({
                    nombre: "",
                });
            })
            .catch((error) => {
                console.error("Error al editar la marca:", error);
            });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormState({ ...formState, [name]: value });
    };

    const validar = () => {
        const { nombre } = formState;
        if (!nombre) {
            alert("No se aceptan campos en blanco");
            return false;
        }
        return true;
    };

    return (
        <div className="container p-2">
            <form className="row g-3 mx-auto border border-2 py-3 px-5 rounded col-8">
                <div>
                    <h3>Datos de la Marca</h3>
                </div>
                <div className="col-12-md-6 px-4">
                    <label className="col-6 pe-4" htmlFor="nombre">
                        Nombre de la Marca
                    </label>
                    <input
                        className="col-6"
                        type="text"
                        name="nombre"
                        value={formState.nombre}
                        id="nombre"
                        onChange={handleChange}
                        placeholder="Ejemplo: Sony"
                    ></input>
                </div>
                <div className="text-center">
                    <button
                        className="btn btn-outline-secondary px-3 mx-1"
                        type="button"
                        onClick={handleClose}
                    >
                        Cancelar
                    </button>
                    <button
                        className="btn btn-primary px-3 mx-1"
                        type="button"
                        onClick={handleSubmit}
                    >
                        Guardar
                    </button>
                </div>
            </form>
        </div>
    );
};
