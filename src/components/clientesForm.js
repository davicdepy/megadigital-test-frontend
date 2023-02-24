import { Formik, Form, Field } from "formik";
import * as Yup from "yup";
import "bootstrap/dist/css/bootstrap.min.css";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { Button, Col, Row } from "react-bootstrap/";
import serviceFetch from "../services/service.js";

function ClientesForm({ setModalStatus, itemValues }) {
  const SignupSchema = Yup.object().shape({
    nombrecompleto: Yup.string().required("Debes ingresar el Nombre"),
    nrodocumento: Yup.string().required("Debes ingresar el Documento"),
    correo: Yup.string().required("Debes ingresar el correo"),
    telefono: Yup.string().required("Debes ingresar el telefono"),
  });

  return (
    <>
      <Formik
        initialValues={{
          id: itemValues?.id ? itemValues.id : "",
          nombrecompleto: itemValues?.nombrecompleto
            ? itemValues.nombrecompleto
            : "",
          nrodocumento: itemValues?.nrodocumento ? itemValues.nrodocumento : "",
          correo: itemValues?.correo ? itemValues.correo : "",
          telefono: itemValues?.telefono ? itemValues.telefono : "",
        }}
        validationSchema={SignupSchema}
        onSubmit={async (values) => {
          if (values.id === "") {
            serviceFetch("http://localhost:3000/api/personas", "POST", values);
          } else {
            await serviceFetch(
              `http://localhost:3000/api/personas/${values.id}`,
              "PUT",
              values
            );
          }
          setModalStatus(false);
        }}
      >
        {({ errors, touched }) => (
          <Form>
            <div className="mb-3">
              <div className="mb-1">Nombre Completo:</div>
              <Field name="nombrecompleto" type="text" className="fullWidth" />
              {errors.nombrecompleto && touched.nombrecompleto && (
                <div className="text-danger">{errors.nombrecompleto}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Numero de Documento:</div>
              <Field name="nrodocumento" type="text" className="fullWidth" />
              {errors.nrodocumento && touched.nrodocumento && (
                <div className="text-danger">{errors.nrodocumento}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Correo Electronico:</div>
              <Field name="correo" type="text" className="fullWidth" />
              {errors.correo && touched.correo && (
                <div className="text-danger">{errors.correo}</div>
              )}
            </div>
            <div className="mb-3">
              <div className="mb-1">Telefono:</div>
              <Field name="telefono" type="text" className="fullWidth" />
              {errors.telefono && touched.telefono && (
                <div className="text-danger">{errors.telefono}</div>
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

export default ClientesForm;
