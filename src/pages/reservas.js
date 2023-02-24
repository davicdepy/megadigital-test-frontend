import { useState, useEffect } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { PencilSquare, Trash } from "react-bootstrap-icons";
import { Button, Col, Row, Container, Table } from "react-bootstrap/";

import MainModal from "../hooks/modal";
import serviceFetch from "../services/service.js";
import ReservasForm from "../components/reservasForm";
import DeletePrompt from "../components/deletePrompt";
import SearchPersona from "../components/clienteTab";
import SearchHabitacion from "../components/habitacionTab";

function Reservas() {
  const [modalStatus, setModalStatus] = useState(false);
  const [modalControl, setModalControl] = useState({});

  const [allFiles, setAllFiles] = useState([]);
  const [nowData, setNowData] = useState(new Date());

  const loadTable = async () => {
    const allData = await serviceFetch(
      "http://localhost:3000/api/reservas",
      "GET"
    );
    const newData = [];
    await allData.forEach(async (element) => {
      let diff =
        new Date(element.fechasalida).getTime() -
        new Date(element.fechaentrada).getTime();
      let diasReserva = diff / (1000 * 60 * 60 * 24);
      let montoInicial = element.montoreserva / diasReserva;

      newData.push({
        id: element.id,
        habitacionid: element.habitacionid,
        personaid: element.personaid,
        habitacion: <SearchHabitacion id={element.habitacionid} />,
        reserva: <SearchPersona id={element.personaid} />,
        creado: element.fechareserva,
        ingreso: element.fechaentrada,
        salida: element.fechasalida,
        monto: montoInicial,
        montoTotal: element.montoreserva,
      });
    });
    setAllFiles(newData);
  };

  const editData = (id = 0, itemValues) => {
    setModalStatus(true);
    setModalControl({
      title: id !== 0 ? "Editar Reserva" : "Nueva Reserva",
      children: (
        <ReservasForm
          setModalStatus={setModalStatus}
          itemValues={itemValues}
          reservasAll={allFiles}
        />
      ),
    });
  };

  const deleteData = (id) => {
    setModalStatus(true);
    setModalControl({
      title: "Borrar Reserva",
      children: (
        <DeletePrompt
          setModalStatus={setModalStatus}
          urlDelete={`http://localhost:3000/api/reservas/${id}`}
        />
      ),
    });
  };

  useEffect(() => {
    loadTable();
  }, [nowData, modalStatus]);

  return (
    <>
      <MainModal
        modalStatus={modalStatus}
        setModalStatus={setModalStatus}
        modalControl={modalControl}
      />
      <Container className="pt-3">
        <Row>
          <Col sm={8}>
            <Table striped bordered>
              <thead>
                <tr>
                  <th>Habitacion</th>
                  <th>Reserva</th>
                  <th>Fecha Reserva</th>
                  <th>Ingreso</th>
                  <th>Salida</th>
                  <th>Monto</th>
                  <th>Editar</th>
                </tr>
              </thead>
              <tbody>
                {allFiles?.map((item, index) => (
                  <tr key={index}>
                    <td>{item.habitacion}</td>
                    <td>{item.reserva}</td>
                    <td>{new Date(item.creado).toDateString().substring(4)}</td>
                    <td>
                      {new Date(item.ingreso).toDateString().substring(4)}
                    </td>
                    <td>{new Date(item.salida).toDateString().substring(4)}</td>
                    <td>
                      Por dia: GS {item.monto}
                      <br />
                      Total: GS {item.montoTotal}
                    </td>
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
          </Col>
          <Col sm={4}>
            <Button
              onClick={() => editData(1)}
              variant="primary"
              className="fullWidth maxPhone mb-3"
            >
              Nueva Reserva
            </Button>
            <Calendar
              onChange={setNowData}
              value={nowData}
              className="fullWidth"
              locale="es-ES"
            />
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Reservas;
