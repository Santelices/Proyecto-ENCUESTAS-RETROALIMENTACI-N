import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/EditarEncuesta.css";

function EditarEncuesta() {
  const { id } = useParams();
  const [encuesta, setEncuesta] = useState({
    titulo: "",
    descripcion: "",
    preguntas: [],
    limite_respuestas: 0
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`https://encretro.onrender.com/encuestas/${id}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEncuesta({
          titulo: data.encuesta.titulo,
          descripcion: data.encuesta.descripcion,
          limite_respuestas: data.encuesta.limite_respuestas || 0, 
          preguntas: data.preguntas.map((pregunta) => ({
            ...pregunta,
            opciones: pregunta.opciones || [], 
          })),
        });
      })
      .catch((error) => console.error("Error al obtener la encuesta:", error));
  }, [id]);

  const handleSave = () => {
    const encuestaToSave = {
      ...encuesta,
      preguntas: encuesta.preguntas.map((pregunta) => ({
        ...pregunta,
        opciones: pregunta.tipo_id === "2" ? pregunta.opciones : [], // Solo enviar opciones si es "Opción múltiple"
      })),
    };

    fetch(`http://localhost:5000/encuestas/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(encuestaToSave),
    })
      .then(() => navigate("/mis-encuestas"))
      .catch((error) =>
        console.error("Error al actualizar la encuesta:", error)
      );
  };

  const volverAmisencuestas = () => {
    navigate("/mis-encuestas");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEncuesta((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const agregarPregunta = () => {
    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: [
        ...prevState.preguntas,
        { texto: "", tipo_id: "1", obligatorio: false, opciones: [] },
      ],
    }));
  };

  const eliminarPregunta = (index) => {
    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: prevState.preguntas.filter((_, i) => i !== index),
    }));
  };

  const handlePreguntaChange = (index, field, value) => {
    const nuevasPreguntas = JSON.parse(JSON.stringify(encuesta.preguntas)); // Hacer una copia profunda
    nuevasPreguntas[index] = {
      ...nuevasPreguntas[index],
      [field]: value,
    };

    if (field === "tipo_id" && value === "1") {
      nuevasPreguntas[index].opciones = [];
    } else if (
      field === "tipo_id" &&
      value === "2" &&
      !nuevasPreguntas[index].opciones
    ) {
      nuevasPreguntas[index].opciones = [{ texto: "" }];
    }

    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: nuevasPreguntas,
    }));
  };

  const agregarOpcion = (preguntaIndex) => {
    const nuevasPreguntas = JSON.parse(JSON.stringify(encuesta.preguntas)); // Hacer una copia profunda
    nuevasPreguntas[preguntaIndex].opciones.push({ texto: "" });
    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: nuevasPreguntas,
    }));
  };

  const handleOpcionChange = (preguntaIndex, opcionIndex, texto) => {
    const nuevasPreguntas = JSON.parse(JSON.stringify(encuesta.preguntas)); // Hacer una copia profunda
    nuevasPreguntas[preguntaIndex].opciones[opcionIndex].texto = texto;
    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: nuevasPreguntas,
    }));
  };

  const eliminarOpcion = (preguntaIndex, opcionIndex) => {
    const nuevasPreguntas = JSON.parse(JSON.stringify(encuesta.preguntas)); // Hacer una copia profunda
    nuevasPreguntas[preguntaIndex].opciones.splice(opcionIndex, 1);
    setEncuesta((prevState) => ({
      ...prevState,
      preguntas: nuevasPreguntas,
    }));
  };

  return encuesta ? (
    <>
      <button className="encuesta-button volver" onClick={volverAmisencuestas}>
        Volver
      </button>
      <div className="editar-encuesta-container">
        <h2 className="titulo-editar-encuesta">Editar Encuesta</h2>

        <input
          type="text"
          name="titulo"
          className="input-titulo-editar"
          value={encuesta.titulo || ""}
          onChange={handleInputChange}
          placeholder="Título de la encuesta"
        />

        <textarea
          name="descripcion"
          className="textarea-descripcion-editar"
          value={encuesta.descripcion || ""}
          onChange={handleInputChange}
          placeholder="Descripción de la encuesta"
        />

        <input
          type="number"
          name="limite_respuestas"
          className="input-field"
          value={encuesta.limite_respuestas || ""}
          onChange={(e) =>
            setEncuesta((prevState) => ({
              ...prevState,
              limite_respuestas: e.target.value,
            }))
          }
          placeholder="Límite de respuestas"
        />

        <h3>Preguntas</h3>
        <div className="preguntas-container">
          {encuesta.preguntas.map((pregunta, preguntaIndex) => (
            <div key={preguntaIndex} className="pregunta-item">
              <input
                type="text"
                value={pregunta.texto}
                onChange={(e) =>
                  handlePreguntaChange(preguntaIndex, "texto", e.target.value)
                }
                placeholder="Texto de la pregunta"
              />
              <div className="tipo-obligatorio-container">
                <select
                  value={pregunta.tipo_id}
                  onChange={(e) =>
                    handlePreguntaChange(preguntaIndex, "tipo_id", e.target.value)
                  }
                >
                  <option value="1">Texto</option>
                  <option value="2">Opción múltiple</option>
                </select>
                <label className="obligatorio-checkbox">
                  Obligatoria
                  <input
                    type="checkbox"
                    checked={pregunta.obligatorio}
                    onChange={(e) =>
                      handlePreguntaChange(
                        preguntaIndex,
                        "obligatorio",
                        e.target.checked
                      )
                    }
                  />
                </label>
              </div>
              <button
                className="eliminar-pregunta-btn"
                onClick={() => eliminarPregunta(preguntaIndex)}
              >
                Eliminar
              </button>

              {pregunta.tipo_id === "2" && (
                <div className="opciones-container">
                  <h4>Opciones</h4>
                  {pregunta.opciones.map((opcion, opcionIndex) => (
                    <div key={opcionIndex} className="opcion-item">
                      <input
                        type="text"
                        placeholder={`Opción ${opcionIndex + 1}`}
                        value={opcion.texto}
                        onChange={(e) =>
                          handleOpcionChange(
                            preguntaIndex,
                            opcionIndex,
                            e.target.value
                          )
                        }
                      />
                      <button
                        className="eliminar-opcion-btn"
                        onClick={() =>
                          eliminarOpcion(preguntaIndex, opcionIndex)
                        }
                      >
                        Eliminar Opción
                      </button>
                    </div>
                  ))}
                  <button className="agregar-opcion-btn" onClick={() => agregarOpcion(preguntaIndex)}>
                    Agregar Opción
                  </button>
                </div>
              )}
            </div>
          ))}
          <button className="agregar-pregunta-btn" onClick={agregarPregunta}>
            Agregar Pregunta
          </button>
        </div>

        <button className="guardar-encuesta-btn" onClick={handleSave}>
          Guardar Cambios
        </button>
      </div>
    </>
  ) : (
    <p>Cargando encuesta...</p>
  );
}

export default EditarEncuesta;
