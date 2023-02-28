import { Formik, Form, Field } from "formik";
import * as BSForm from "react-bootstrap/Form";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button, Col, Row } from "react-bootstrap/";
import serviceFetch from "../services/service.js";

function HabitacionesForm({ setModalStatus, itemValues }) {
  const SignupSchema = Yup.object().shape({
    habitacionpiso: Yup.number()
      .min(1)
      .max(10)
      .default(1)
      .required("Debes ingresar el Piso entre 0 y 10"),
    habitacionnro: Yup.number()
      .min(1)
      .max(20)
      .default(1)
      .required("Debes ingresar el Numero entre 0 y 20"),
    cantcamas: Yup.number()
      .min(1)
      .max(4)
      .default(1)
      .required("Debes ingresar las camas entre 1 y 4"),
  });

  return (
    <>
      <Formik
        initialValues={{
          id: itemValues?.id ? itemValues.id : "",
          habitacionpiso: itemValues?.habitacionpiso
            ? itemValues.habitacionpiso
            : "",
          habitacionnro: itemValues?.habitacionnro
            ? itemValues.habitacionnro
            : "",
          cantcamas: itemValues?.cantcamas ? itemValues.cantcamas : "",
          tienetelevision: itemValues?.tienetelevision === 0 ? false : true,
          tienefrigobar: itemValues?.tienefrigobar === 0 ? false : true,
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          if (values.id === "") {
            await serviceFetch(
              "http://localhost:3000/api/habitaciones",
              "POST",
              values
            );
          } else {
            await serviceFetch(
              `http://localhost:3000/api/habitaciones/${values.id}`,
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
              <div className="mb-1">Piso de la Habitacion:</div>
              <Field
                name="habitacionpiso"
                type="number"
                className="fullWidth"
              />
              {errors.habitacionpiso && touched.habitacionpiso && (
                <div className="text-danger">{errors.habitacionpiso}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Numero de habitacion:</div>
              <Field name="habitacionnro" type="text" className="fullWidth" />
              {errors.habitacionnro && touched.habitacionnro && (
                <div className="text-danger">{errors.habitacionnro}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Cantidad de camas:</div>
              <Field name="cantcamas" type="text" className="fullWidth" />
              {errors.cantcamas && touched.cantcamas && (
                <div className="text-danger">{errors.cantcamas}</div>
              )}
            </div>
            <div className="mb-3">
              <BSForm.default.Check
                type="switch"
                id="tienetelevision"
                label="Tiene television"
                name="tienetelevision"
                checked={values.tienetelevision}
                onChange={() => {
                  setFieldValue("tienetelevision", !values.tienetelevision);
                }}
              />
            </div>
            <div className="mb-3">
              <BSForm.default.Check
                type="switch"
                id="tienefrigobar"
                label="Tiene frigobar"
                name="tienefrigobar"
                checked={values.tienefrigobar}
                onChange={() => {
                  setFieldValue("tienefrigobar", !values.tienefrigobar);
                }}
              />
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

export default HabitacionesForm;
