import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from 'chart.js';
import './styles/Resultados.css';

ChartJS.register(ArcElement, Tooltip, Legend, Title);

function ResultadosEncuesta() {
  const { encuesta_id } = useParams();
  const navigate = useNavigate();
  const [resultados, setResultados] = useState(null);

  useEffect(() => {
    fetch(`https://encretro.onrender.com/encuestas/${encuesta_id}/resultados`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then(response => response.json())
      .then(data => setResultados(data))
      .catch(error => console.error("Error al cargar resultados:", error));
  }, [encuesta_id]);

  const volverAmisencuestas = () => {
    navigate("/mis-encuestas");
  };

  return resultados ? (
    <>
      <button className="encuesta-button volver" onClick={volverAmisencuestas}>
        Volver
      </button>
      <div className="resultados-container">
        <h2>Resultados de la encuesta: {resultados.encuesta.titulo}</h2>

        {resultados.preguntas.map((pregunta) => {
          if (pregunta.tipo_id === 2) {
            const opciones = resultados.resultados_opciones[pregunta.id];
            const data = {
              labels: Object.keys(opciones),
              datasets: [
                {
                  data: Object.values(opciones),
                  backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#FF23EB"],
                },
              ],
            };
            const options = {
              plugins: {
                legend: {
                  position: 'left',
                  labels: {
                    font: {
                      size: 16, 
                    },
                    color: '#333', 
                  },
                },
                tooltip: {
                  enabled: true, 
                  callbacks: {
                    label: function (tooltipItem) {
                      const label = tooltipItem.label || '';
                      const value = tooltipItem.raw;
                      return `${label}: ${value} respuestas`;
                    },
                  },
                },
              },
              maintainAspectRatio: false,
              responsive: true,
            };

            return (
              <div key={pregunta.id} className="resultados-card">
                <h3>{pregunta.texto}</h3>
                <div className="pie-chart-container">
                  <Pie data={data} options={options} className="pie-chart" />
                </div>
              </div>
            );
          }
          return null;
        })}

        {resultados.preguntas.map(
          (pregunta) =>
            pregunta.tipo_id === 1 && (
              <div key={pregunta.id} className="resultados-card">
                <h3>{pregunta.texto}</h3>
                <ul style={{ listStyleType: "none", padding: 0 }}>                  
                    {resultados.resultados_texto[pregunta.id].map(
                    (respuesta, index) => (
                      <li key={index} >{respuesta}</li>
                    )
                  )}
                </ul>
              </div>
            )
        )}
      </div>
    </>
  ) : (
    <p>Cargando encuesta...</p>
  );
}

export default ResultadosEncuesta;
