import { useState, useEffect } from "react";
import serviceFetch from "../services/service.js";

function SearchPersona({ id }) {
  const [persona, setPersona] = useState({});

  const loadSubPersona = async (id) => {
    const allData = await serviceFetch(
      `http://localhost:3000/api/personas/${id}`,
      "GET"
    );
    setPersona(allData);
  };

  useEffect(() => {
    loadSubPersona(id);
  }, [id]);

  return (
    <>
      <div>
        {persona.nombrecompleto
          ? `${persona.nombrecompleto} | ${persona.correo}`
          : "Se ha borrado este cliente!"}
      </div>
    </>
  );
}

export default SearchPersona;
