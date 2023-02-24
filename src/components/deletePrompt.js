import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Col, Row, Container } from "react-bootstrap/";
import serviceFetch from "../services/service.js";

function DeletePrompt({ setModalStatus, urlDelete }) {

  const processDelete = async () => {
    await serviceFetch(urlDelete,'DELETE');
    setModalStatus(false);
  };

  return (
    <>
      <Container className="pt-3">
        <h1 className="text-center">Seguro de Borrar?</h1>
        <Row className="mt-5">
          <Col sm={6} className="d-flex justify-content-end">
            <Button onClick={() => processDelete()} variant="danger">
              Si, Proceder
            </Button>
          </Col>
          <Col sm={6} className="d-flex justify-content-start">
            <Button onClick={() => setModalStatus(false)} variant="secondary">
              Cancelar
            </Button>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default DeletePrompt;
