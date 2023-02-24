import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Button, Container, Table } from "react-bootstrap/";

import MainModal from "../hooks/modal";
import serviceFetch from "../services/service.js";
import HabitacionesForm from "../components/habitacionesForm";
import DeletePrompt from "../components/deletePrompt";

function Habitaciones() {
  const [modalStatus, setModalStatus] = useState(false);
  const [modalControl, setModalControl] = useState({});

  const [allFiles, setAllFiles] = useState([]);

  const loadTable = async () => {
    const allData = await serviceFetch(
      "http://localhost:3000/api/habitaciones",
      "GET"
    );
    setAllFiles(allData);
  };

  const editData = (id = 0, itemValues) => {
    setModalStatus(true);
    setModalControl({
      title: id !== 0 ? "Editar Habitacion" : "Nuevo Habitacion",
      children: (
        <HabitacionesForm
          setModalStatus={setModalStatus}
          itemValues={itemValues}
        />
      ),
    });
  };

  const deleteData = (id) => {
    setModalStatus(true);
    setModalControl({
      title: "Borrar Habitacion",
      children: (
        <DeletePrompt
          setModalStatus={setModalStatus}
          urlDelete={`http://localhost:3000/api/habitaciones/${id}`}
        />
      ),
    });
  };

  useEffect(() => {
    loadTable();
  }, [modalStatus]);

  return (
    <>
      <MainModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
        modalControl={modalControl}
      />
      <Container className="pt-3">
        <div className="mb-2">
          <Button
            onClick={() => editData(1)}
            variant="primary"
            className="fullWidth maxPhone mb-3"
          >
            Nueva Habitacion
          </Button>
        </div>
        <Table striped bordered>
          <thead>
            <tr>
              <th>Piso</th>
              <th>Numero</th>
              <th>Camas</th>
              <th>Television</th>
              <th>Frigobar</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {allFiles?.map((item, index) => (
              <tr key={index}>
                <td>{item.habitacionpiso}</td>
                <td>{item.habitacionnro}</td>
                <td>{item.cantcamas}</td>
                <td>{item.tienetelevision ? "Si" : "No"}</td>
                <td>{item.tienefrigobar ? "Si" : "No"}</td>
                <td>
                  <PencilSquare
                    color="blue"
                    onClick={() => editData(item.id, item)}
                    className="me-3 pointer"
                  />
                  <Trash
                    className="pointer"
                    onClick={() => deleteData(item.id)}
                    color="red"
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Container>
    </>
  );
}

export default Habitaciones;
