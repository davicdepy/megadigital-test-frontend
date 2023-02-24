import { addDays } from "date-fns";
import es from "date-fns/locale/es";
import { useState, useEffect } from "react";
import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css";
import { DateRangePicker, defaultStaticRanges } from "react-date-range";
import "react-date-range/dist/theme/default.css";
import { Button, Col, Row } from "react-bootstrap/";
import serviceFetch from "../services/service.js";

function ReservasForm({ setModalStatus, itemValues, reservasAll }) {
  const [allClientes, setAllClientes] = useState([]);
  const [allHabitaciones, setAllHabitaciones] = useState([]);

  let spanishNames = [
    "Hoy",
    "Ayer",
    "Esta Semana",
    "Sem. Anterior",
    "Este mes",
    "Mes Anterior",
  ];
  let updatedButons = [];
  defaultStaticRanges.forEach((element, index) => {
    updatedButons.push({
      label: spanishNames[index],
      range: element.range,
      isSelected: element.isSelected,
    });
  });

  const [selectionRange, setSelectionRange] = useState({
    startDate: itemValues?.ingreso ? new Date(itemValues.ingreso) : new Date(),
    endDate: itemValues?.salida ? new Date(itemValues.salida) : new Date(),
    key: "selection",
  });

  const SignupSchema = Yup.object().shape({
    habitacionid: Yup.string().min(1).required("Debes ingresar el Monto"),
    personaid: Yup.string().min(1).required("Debes ingresar el Monto"),
    montoreserva: Yup.string().required("Debes ingresar el Monto"),
  });

  const loadSelect = async (filter = false, entrada = "", salida = "") => {
    const allClientes = await serviceFetch(
      "http://localhost:3000/api/personas",
      "GET"
    );
    setAllClientes(allClientes);
    const allHabitaciones = await serviceFetch(
      "http://localhost:3000/api/habitaciones",
      "GET"
    );
    if (filter) {
      const habitacionesLibres = [];
      const habitacionesOcupadas = [];
      reservasAll.forEach((element) => {
        if (
          new Date(entrada) >= new Date(element.ingreso) &&
          new Date(element.salida) <= new Date(salida)
        ) {
          habitacionesOcupadas.push(element.habitacionid);
        }
      });
      allHabitaciones.forEach((element) => {
        if (!habitacionesOcupadas.includes(element.id)) {
          habitacionesLibres.push(element);
        }
      });

      setAllHabitaciones(habitacionesLibres);
    } else {
      setAllHabitaciones(allHabitaciones);
    }
  };

  useEffect(() => {
    loadSelect();
  }, []);

  return (
    <>
      <Formik
        initialValues={{
          id: itemValues?.id ? itemValues.id : "",
          fechaentrada: itemValues?.ingreso ? itemValues.ingreso : "",
          fechasalida: itemValues?.salida ? itemValues.salida : "",
          habitacionid: itemValues?.habitacionid ? itemValues.habitacionid : "",
          personaid: itemValues?.personaid ? itemValues.personaid : "",
          montoreserva: itemValues?.monto ? itemValues.monto : "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          if (values.fechasalida === values.fechaentrada) {
            alert("Fecha de entrada debe ser mayor al día actual");
            return;
          }

          let startDate = new Date(values.fechaentrada);
          let endDate = new Date(values.fechasalida);
          let diff = endDate.getTime() - startDate.getTime();
          let diasReserva = diff / (1000 * 60 * 60 * 24);

          values.fechaentrada =
            startDate.getFullYear().toString() +
            "-" +
            ((startDate.getMonth() + 1).toString().length === 2
              ? (startDate.getMonth() + 1).toString()
              : "0" + (startDate.getMonth() + 1).toString()) +
            "-" +
            (startDate.getDate().toString().length === 2
              ? startDate.getDate().toString()
              : "0" + startDate.getDate().toString()) +
            " " +
            (startDate.getHours().toString().length === 2
              ? startDate.getHours().toString()
              : "0" + startDate.getHours().toString()) +
            ":" +
            ((parseInt(startDate.getMinutes() / 5) * 5).toString().length === 2
              ? (parseInt(startDate.getMinutes() / 5) * 5).toString()
              : "0" + (parseInt(startDate.getMinutes() / 5) * 5).toString()) +
            ":00";

          values.fechasalida =
            endDate.getFullYear().toString() +
            "-" +
            ((endDate.getMonth() + 1).toString().length === 2
              ? (endDate.getMonth() + 1).toString()
              : "0" + (endDate.getMonth() + 1).toString()) +
            "-" +
            (endDate.getDate().toString().length === 2
              ? endDate.getDate().toString()
              : "0" + endDate.getDate().toString()) +
            " " +
            (endDate.getHours().toString().length === 2
              ? endDate.getHours().toString()
              : "0" + endDate.getHours().toString()) +
            ":" +
            ((parseInt(endDate.getMinutes() / 5) * 5).toString().length === 2
              ? (parseInt(endDate.getMinutes() / 5) * 5).toString()
              : "0" + (parseInt(endDate.getMinutes() / 5) * 5).toString()) +
            ":00";

          values.montoreserva = values.montoreserva * diasReserva;

          if (values.id === "") {
            await serviceFetch(
              "http://localhost:3000/api/reservas",
              "POST",
              values
            );
          } else {
            await serviceFetch(
              `http://localhost:3000/api/reservas/${values.id}`,
              "PUT",
              values
            );
          }
          setModalStatus(false);
        }}
      >
        {({ setFieldValue, values, errors, touched }) => (
          <Form>
            <div className="mb-3">
              <DateRangePicker
                staticRanges={[]}
                inputRanges={[]}
                locale={es}
                className="fullWidth"
                ranges={[selectionRange]}
                minDate={addDays(new Date(), 1)}
                onChange={(ranges) => {
                  setSelectionRange(ranges.selection);
                  setFieldValue(
                    "fechaentrada",
                    new Date(ranges.selection.startDate).toISOString()
                  );
                  setFieldValue(
                    "fechasalida",
                    new Date(ranges.selection.endDate).toISOString()
                  );

                  loadSelect(
                    true,
                    ranges.selection.startDate,
                    ranges.selection.endDate
                  );
                }}
              />
            </div>
            <div className="mb-3">
              <div className="mb-1">Habitacion:</div>
              <Field
                as="select"
                name="habitacionid"
                className="fullWidth"
                onChange={(e) => {
                  setFieldValue("habitacionid", e.target.value);
                }}
              >
                <option value="">Selecciona la habitacion</option>
                {allHabitaciones?.map((item, index) => (
                  <option key={index} value={item.id}>
                    Piso {item.habitacionpiso} - #{item.habitacionnro}
                  </option>
                ))}
              </Field>
              {errors.habitacionid && touched.habitacionid && (
                <div className="text-danger">{errors.habitacionid}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Cliente:</div>
              <Field
                as="select"
                name="personaid"
                className="fullWidth"
                onChange={(e) => {
                  setFieldValue("personaid", e.target.value);
                }}
              >
                <option value="">Selecciona al cliente</option>
                {allClientes?.map((item, index) => (
                  <option key={index} value={item.id}>
                    {item.nombrecompleto}
                  </option>
                ))}
              </Field>
              {errors.personaid && touched.personaid && (
                <div className="text-danger">{errors.personaid}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Monto de Reserva:</div>
              <Field name="montoreserva" type="text" className="fullWidth" />
              {errors.montoreserva && touched.montoreserva && (
                <div className="text-danger">{errors.montoreserva}</div>
              )}
            </div>

            <Row className="mt-3">
              <Col sm={6} className="d-flex justify-content-end">
                <Button type="submit" variant="primary">
                  Guardar
                </Button>
              </Col>
              <Col sm={6} className="d-flex justify-content-start">
                <Button onClick={() => setModalStatus(false)} variant="danger">
                  Cancelar
                </Button>
              </Col>
            </Row>
          </Form>
        )}
      </Formik>
    </>
  );
}

export default ReservasForm;
