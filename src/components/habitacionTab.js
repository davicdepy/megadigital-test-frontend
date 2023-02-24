import { useState, useEffect } from "react";
import serviceFetch from "../services/service.js";

function SearchHabitacion({ id }) {
  const [habitacion, setHabitacion] = useState({});

  const loadSubPersona = async (id) => {
    const allData = await serviceFetch(
      `http://localhost:3000/api/habitaciones/${id}`,
      "GET"
    );
    setHabitacion(allData);
  };

  useEffect(() => {
    loadSubPersona(id);
  }, [id]);

  return (
    <>
      <div>
        {habitacion.habitacionpiso
          ? `Piso No: ${habitacion.habitacionpiso} Numero: ${habitacion.habitacionnro}`
          : "Se ha borrado esta habitacion!"}
      </div>
    </>
  );
}

export default SearchHabitacion;
