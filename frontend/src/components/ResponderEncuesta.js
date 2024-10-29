import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function ResponderEncuesta() {
  const { id_unico } = useParams(); // Captura el id_unico de la URL
  const navigate = useNavigate(); // Para redirigir después de enviar
  const [encuesta, setEncuesta] = useState(null);
  const [respuestas, setRespuestas] = useState({});
  const [errores, setErrores] = useState([]);

  // Cargar la encuesta desde el backend
  useEffect(() => {
    fetch(`https://encretro.onrender.com/encuestas/compartir/${id_unico}`)
      .then((response) => response.json())
      .then((data) => setEncuesta(data))
      .catch((error) => console.error("Error al cargar la encuesta:", error));
  }, [id_unico]);

  // Función para manejar las respuestas del usuario
  const handleInputChange = (preguntaId, value) => {
    setRespuestas((prevRespuestas) => ({
      ...prevRespuestas,
      [preguntaId]: value,
    }));
  };

  // Función para validar respuestas obligatorias
  const validarRespuestas = () => {
    const preguntasNoRespondidas = encuesta.preguntas.filter(
      (pregunta) => pregunta.obligatorio && !respuestas[pregunta.id]
    );

    if (preguntasNoRespondidas.length > 0) {
      setErrores(preguntasNoRespondidas.map((pregunta) => pregunta.texto));
      return false;
    }

    setErrores([]);
    return true;
  };

  const handleSubmit = () => {
    if (!validarRespuestas()) {
      alert("Por favor, responde todas las preguntas obligatorias.");
      return;
    }

    fetch(`https://encretro.onrender.com/encuestas/${id_unico}/responder`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ respuestas }),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error); // Maneja el mensaje de error desde el backend
          });
        }
        return response.json();
      })
      .then((data) => {
        console.log("Respuestas enviadas:", data);
        alert("¡Gracias por responder!");
        navigate("/"); 
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  return encuesta ? (
    <>
      <div className="encuesta-container">
        <div className="encuesta-header">
          <h2>{encuesta.encuesta.titulo}</h2>
          <p>{encuesta.encuesta.descripcion}</p>
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >
          {encuesta.preguntas.map((pregunta) => (
            <div className="pregunta-item-VP" key={pregunta.id}>
              <p>
                {pregunta.texto}{" "}
                {pregunta.obligatorio && (
                  <span style={{ color: "red" }}> *</span>
                )}
              </p>
              {pregunta.tipo_id === 1 ? (
                <input
                  type="text"
                  className="input-respuesta-texto"
                  placeholder="Escribe tu respuesta aquí..."
                  onChange={(e) =>
                    handleInputChange(pregunta.id, e.target.value)
                  }
                />
              ) : (
                pregunta.opciones.map((opcion) => (
                  <div key={opcion.id} className="opcion-item-VP">
                    <input
                      type="radio"
                      name={`pregunta-${pregunta.id}`}
                      value={opcion.texto}
                      onChange={(e) =>
                        handleInputChange(pregunta.id, opcion.texto)
                      }
                    />
                    <label>{opcion.texto}</label>
                  </div>
                ))
              )}
            </div>
          ))}
          {errores.length > 0 && (
            <div className="error-message">
              <p>Responde las siguientes preguntas obligatorias:</p>
              <ul>
                {errores.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </div>
          )}
          <div className="button-container">
            <button type="submit" className="submit-btn">
              Enviar Respuestas
            </button>
          </div>
        </form>
      </div>
    </>
  ) : (
    <p>Cargando encuesta...</p>
  );
}

export default ResponderEncuesta;
