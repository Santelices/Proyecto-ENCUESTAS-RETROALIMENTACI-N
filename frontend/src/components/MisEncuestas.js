import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom"; // Para redireccionar al dashboard
import "./styles/MisEncuestas.css";

function MisEncuestas() {
  const [encuestas, setEncuestas] = useState([]);
  const [selectedEncuestas, setSelectedEncuestas] = useState([]);
  const navigate = useNavigate();

  // Cargar las encuestas desde el backend cuando se monta el componente
  useEffect(() => {
    fetch("https://encretro.onrender.com/encuestas", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setEncuestas(data); // Guardar las encuestas obtenidas en el estado
      })
      .catch((error) => {
        console.error("Error al obtener las encuestas:", error);
      });
  }, []);

  // Función para eliminar encuestas seleccionadas
  const eliminarSeleccionadas = () => {
    selectedEncuestas.forEach((id) => {
      fetch(`https://encretro.onrender.com/encuestas/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
        .then((response) => {
          if (response.ok) {
            setEncuestas(
              encuestas.filter(
                (encuesta) => !selectedEncuestas.includes(encuesta.id)
              )
            );
            setSelectedEncuestas([]);
          } else {
            console.error("Error al eliminar la encuesta");
          }
        })
        .catch((error) => {
          console.error("Error al eliminar la encuesta:", error);
        });
    });
  };

  // Función para manejar la selección de encuestas individuales
  const toggleSelectEncuesta = (id) => {
    if (selectedEncuestas.includes(id)) {
      setSelectedEncuestas(
        selectedEncuestas.filter((encuestaId) => encuestaId !== id)
      );
    } else {
      setSelectedEncuestas([...selectedEncuestas, id]);
    }
  };

  // Función para seleccionar o deseleccionar todas las encuestas
  const toggleSelectAll = () => {
    if (selectedEncuestas.length === encuestas.length) {
      setSelectedEncuestas([]);
    } else {
      setSelectedEncuestas(encuestas.map((encuesta) => encuesta.id));
    }
  };
  //
  const handleEdit = (id) => {
    navigate(`/editar-encuesta/${id}`);
  };

  const handleVistaPrevia = (id) => {
    navigate(`/vista-previa/${id}`);
  };

  const handleVerResultados = (id) => {
    navigate(`/encuestas/${id}/resultados`);
  };

  // Función para copiar el enlace al portapapeles
  const copiarEnlace = (id_unico) => {
    const url = `https://encretro.onrender.com/encuestas/${id_unico}/responder`;
    navigator.clipboard
      .writeText(url)
      .then(() => alert("Enlace copiado al portapapeles"))
      .catch((err) => console.error("Error al copiar el enlace:", err));
  };

  const volverAlDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <div className="main-content-mis-encuesta">
      <button className="encuesta-button volver" onClick={volverAlDashboard}>
        Volver
      </button>
      <div className="mis-encuestas">
        <h2 className="titulo-mis-encuestas"> Mis Encuestas</h2>
        <table className="encuestas-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedEncuestas.length === encuestas.length}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Título</th>
              <th>Descripción</th>
              <th>Estado</th>
              <th>Acciones</th>
              <th>Vista previa</th>
              <th>Resultados</th>
            </tr>
          </thead>
          <tbody>
            {encuestas.map((encuesta) => (
              <tr key={encuesta.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedEncuestas.includes(encuesta.id)}
                    onChange={() => toggleSelectEncuesta(encuesta.id)}
                  />
                </td>
                <td>{encuesta.titulo}</td>
                <td>{encuesta.descripcion}</td>
                <td>{encuesta.estado}</td>{" "}
                {/* Muestra el estado de la encuesta */}
                <td>
                  <button
                    className="encuesta-button editar"
                    onClick={() => handleEdit(encuesta.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="encuesta-button compartir"
                    onClick={() => copiarEnlace(encuesta.id_unico)}
                  >
                    Compartir
                  </button>
                </td>
                <td>
                  <button
                    className="encuesta-button vista-previa"
                    onClick={() => handleVistaPrevia(encuesta.id)}
                  >
                    Vista previa
                  </button>
                </td>
                <td>
                  {encuesta.estado === "Cerrada" ? (
                    <button
                      className="encuesta-button resultados"
                      onClick={() => handleVerResultados(encuesta.id)}
                    >
                      Ver resultados
                    </button>
                  ) : (
                    <span>En espera</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {selectedEncuestas.length > 0 && (
          <button
            className="encuesta-button eliminar"
            onClick={eliminarSeleccionadas}
          >
            Eliminar seleccionadas
          </button>
        )}
      </div>
    </div>
  );
}

export default MisEncuestas;
