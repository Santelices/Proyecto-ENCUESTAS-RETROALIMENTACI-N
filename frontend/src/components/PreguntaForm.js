import React, { useState, useEffect } from 'react';
import './styles/PreguntaForm.css';

function PreguntaForm({ pregunta, onUpdate, onDelete }) {
  const [opciones, setOpciones] = useState(pregunta.opciones || []);

  useEffect(() => {
    setOpciones(pregunta.opciones || []);
  }, [pregunta]);

  // Esto maneja el cambio de los input de la pregunta
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newPregunta = {
      ...pregunta,
      [name]: type === 'checkbox' ? checked : value,
    };

    // Si se cambia a "Texto" se elimina las opciones
    if (name === 'tipo_id' && value === '1') {
      newPregunta.opciones = [];
      setOpciones([]);
    }

    onUpdate(newPregunta);
  };

  const agregarOpcion = () => {
    const nuevasOpciones = [...opciones, ''];
    setOpciones(nuevasOpciones);
    onUpdate({ ...pregunta, opciones: nuevasOpciones });
  };

  const actualizarOpcion = (index, valor) => {
    const nuevasOpciones = [...opciones];
    nuevasOpciones[index] = valor;
    setOpciones(nuevasOpciones);
    onUpdate({ ...pregunta, opciones: nuevasOpciones });
  };

  const eliminarOpcion = (index) => {
    const nuevasOpciones = opciones.filter((_, i) => i !== index);
    setOpciones(nuevasOpciones);
    onUpdate({ ...pregunta, opciones: nuevasOpciones });
  };

  return (
    <div className="pregunta-form">
      <input
        type="text"
        name="texto"
        placeholder="Escribe tu pregunta..."
        value={pregunta.texto}
        onChange={handleChange}
        className="input-field"
      />

      <select
        name="tipo_id"
        value={pregunta.tipo_id}
        onChange={handleChange}
        className="select-field"
      >
        <option value="1">Respuesta de Texto</option>
        <option value="2">Opción Múltiple</option>
      </select>

      {pregunta.tipo_id === '2' && (
        <div className="opciones-container">
          <h4>Opciones de Respuesta</h4>
          {opciones.map((opcion, index) => (
            <div key={index} className="opcion">
              <input
                type="text"
                placeholder={`Opción ${index + 1}`}
                value={opcion}
                onChange={(e) => actualizarOpcion(index, e.target.value)}
                className="input-field"
              />
              <button
                className="eliminar-opcion-btn"
                onClick={() => eliminarOpcion(index)}
              >
                Eliminar Opción
              </button>
            </div>
          ))}
          <button className="agregar-opcion-btn" onClick={agregarOpcion}>
            Agregar Opción
          </button>
        </div>
      )}

      <label className="checkbox-label">
        <input
          type="checkbox"
          name="obligatorio"
          checked={pregunta.obligatorio}
          onChange={handleChange}
        />
        Obligatoria
      </label>

      <button className="eliminar-pregunta-btn" onClick={onDelete}>
        Eliminar Pregunta
      </button>
    </div>
  );
}

export default PreguntaForm;
