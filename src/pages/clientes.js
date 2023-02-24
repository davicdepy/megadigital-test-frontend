import { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Button, Container, Table } from "react-bootstrap/";

import MainModal from "../hooks/modal";
import serviceFetch from "../services/service.js";
import ClientesForm from "../components/clientesForm";
import DeletePrompt from "../components/deletePrompt";

function Clientes() {
  const [modalStatus, setModalStatus] = useState(false);
  const [modalControl, setModalControl] = useState({});

  const [allFiles, setAllFiles] = useState([]);

  const loadTable = async () => {
    const allData = await serviceFetch(
      "http://localhost:3000/api/personas",
      "GET"
    );
    setAllFiles(allData);
  };

  const editData = (id = 0, itemValues) => {
    setModalStatus(true);
    setModalControl({
      title: id !== 0 ? "Editar Cliente" : "Nuevo Cliente",
      children: (
        <ClientesForm setModalStatus={setModalStatus} itemValues={itemValues} />
      ),
    });
  };

  const deleteData = (id) => {
    setModalStatus(true);
    setModalControl({
      title: "Borrar Cliente",
      children: (
        <DeletePrompt
          setModalStatus={setModalStatus}
          urlDelete={`http://localhost:3000/api/personas/${id}`}
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
            onClick={() => editData(0)}
            variant="primary"
            className="fullWidth maxPhone mb-3"
          >
            Nuevo Cliente
          </Button>
        </div>
        <Table striped bordered>
          <thead>
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Numero NR</th>
              <th>Correo</th>
              <th>Telefono</th>
              <th>Editar</th>
            </tr>
          </thead>
          <tbody>
            {allFiles?.map((item, index) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>{item.nombrecompleto}</td>
                <td>{item.nrodocumento}</td>
                <td>{item.correo}</td>
                <td>{item.telefono}</td>
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

export default Clientes;
