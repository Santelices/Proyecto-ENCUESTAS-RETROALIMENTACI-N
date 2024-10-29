import React, { useEffect, useState } from 'react';

function ContadorVisitas() {
  const [visitas, setVisitas] = useState(0);

  useEffect(() => {
    fetch("http://localhost:5000/registrar-visita", {
      method: "POST",
    })
      .then(response => response.json())
      .then(data => setVisitas(data.total_visitas))
      .catch(error => console.error("Error al obtener el contador de visitas:", error));
  }, []);

  return (
    <div className="contador-visitas">
      <p>👀 Visitas en esta página: {visitas}</p>
    </div>
  );
}

export default ContadorVisitas;
