import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './styles/VistaPrevia.css';

function VistaPrevia() {
  const { id } = useParams();
  const [encuesta, setEncuesta] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:5000/encuestas/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEncuesta(data);
      })
      .catch((error) => console.error('Error al obtener la encuesta:', error));
  }, [id]);

  const volverAmisencuestas = () => {
    navigate("/mis-encuestas");
  };

  return encuesta ? (
    <>
      <button className="volver-btn" onClick={volverAmisencuestas}>
        Volver
      </button>
      <div className="encuesta-container">
        <div className="encuesta-header">
          <h2>{encuesta.encuesta.titulo}</h2>
          <p>{encuesta.encuesta.descripcion}</p>
        </div>
        <div className="preguntas-container-VP">
          {encuesta.preguntas.map((pregunta, index) => (
            <div key={index} className="pregunta-item-VP">
              <p>{pregunta.texto}</p>
              {pregunta.tipo_id === 2 && (
                <div>
                  {pregunta.opciones.map((opcion, opcionIndex) => (
                    <div key={opcionIndex} className="opcion-item-VP">
                      <input
                        type="radio" 
                        id={`opcion-${index}-${opcionIndex}`}
                        name={`pregunta-${index}`}
                        value={opcion.texto}
                      />
                      <label htmlFor={`opcion-${index}-${opcionIndex}`}>
                        {opcion.texto}
                      </label>
                    </div>
                  ))}
                </div>
              )}
              {pregunta.tipo_id === 1 && (
                <input
                  type="textarea"
                  className="input-respuesta-texto"
                  placeholder="Escribe tu respuesta aquí..."
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </>
  ) : (
    <p>Cargando encuesta...</p>
  );
}

export default VistaPrevia;
