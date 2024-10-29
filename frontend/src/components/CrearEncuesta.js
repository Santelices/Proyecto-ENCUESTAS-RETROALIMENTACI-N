import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; 
import './styles/CrearEncuesta.css';
import PreguntaForm from './PreguntaForm';

function CrearEncuesta() {
  const [titulo, setTitulo] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [preguntas, setPreguntas] = useState([]);
  const [limiteRespuestas, setLimiteRespuestas] = useState(''); 
  const navigate = useNavigate();  

  const agregarPregunta = () => {
    setPreguntas([...preguntas, { texto: '', tipo_id: '1', obligatorio: false }]);
  };

  const actualizarPregunta = (index, preguntaActualizada) => {
    const nuevasPreguntas = [...preguntas];
    nuevasPreguntas[index] = preguntaActualizada;
    setPreguntas(nuevasPreguntas);
  };

  const eliminarPregunta = (index) => {
    const nuevasPreguntas = preguntas.filter((_, i) => i !== index);
    setPreguntas(nuevasPreguntas);
  };

  const [errorMessage, setErrorMessage] = useState('');
  
  const guardarEncuesta = () => {
    // Validación
    if (!titulo.trim() || !descripcion.trim()) {
      setErrorMessage('Por favor, completa el título y la descripción de la encuesta.');
      return;
    }
    
    if (preguntas.length === 0) {
      setErrorMessage('Agrega al menos una pregunta a la encuesta.');
      return;
    }
    
    for (let i = 0; i < preguntas.length; i++) {
      if (!preguntas[i].texto.trim()) {
        setErrorMessage(`La pregunta ${i + 1} está vacía. Por favor, completa todas las preguntas.`);
        return;
      }
    }
    
    setErrorMessage('');
    
    const encuesta = {
      titulo,
      descripcion,
      limite_respuestas: limiteRespuestas ? parseInt(limiteRespuestas, 10) : null, // Agrega límite de respuestas si se especifica
      preguntas,
    };
    
    fetch('https://encretro.onrender.com/encuestas', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}` 
      },
      body: JSON.stringify(encuesta)
    })
    .then(response => {
      if (!response.ok) {
        throw new Error('Error en la respuesta del servidor');
      }
      return response.json();
    })
    .then(data => {
      console.log('Encuesta creada:', data);
      navigate('/mis-encuestas');  
    })
    .catch(error => {
      console.error('Error al crear la encuesta:', error);
    });
  };

  const volverAlDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="main-content-crear-encuesta">
      <button className="volver-btn" onClick={volverAlDashboard}>
        Volver
      </button>
      <div className="crear-encuesta-container">
        <h2 className="titulo-crear-encuesta">Crear Nueva Encuesta</h2>
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <input
          type="text"
          placeholder="Título de la Encuesta"
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          className="input-field"
        />
        <textarea
          placeholder="Descripción"
          value={descripcion}
          onChange={(e) => setDescripcion(e.target.value)}
          className="input-field"
        />
        <input
          type="number"
          placeholder="Límite de respuestas (opcional)"
          value={limiteRespuestas}
          onChange={(e) => setLimiteRespuestas(e.target.value)}
          min="1"
          className="input-field"
        />
        {preguntas.map((pregunta, index) => (
          <PreguntaForm
            key={index}
            pregunta={pregunta}
            onUpdate={(preguntaActualizada) => actualizarPregunta(index, preguntaActualizada)}
            onDelete={() => eliminarPregunta(index)}
          />
        ))}
        <button className="agregar-pregunta-btn" onClick={agregarPregunta}>
          Agregar Pregunta
        </button>
        <button className="guardar-encuesta-btn" onClick={guardarEncuesta}>
          Guardar Encuesta
        </button>
      </div>
    </div>
  );
}

export default CrearEncuesta;
