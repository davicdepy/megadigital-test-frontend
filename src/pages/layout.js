import { useState } from "react";
import { Outlet, Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button, Container, Form, Nav, Navbar } from "react-bootstrap/";

function Layout() {
  const [search, setSearch] = useState("");

  return (
    <>
      <Navbar bg="primary" variant="dark" expand="lg">
        <Container fluid>
          <Navbar.Brand href="#">Reservaciones App</Navbar.Brand>
          <Navbar.Toggle aria-controls="navbarScroll" />
          <Navbar.Collapse id="navbarScroll">
            <Nav className="me-auto"></Nav>
            <Nav>
              <div className="ms-3 me-3">
                <Link
                  className="text-white text-decoration-none linksClass"
                  to="/"
                >
                  Reservas
                </Link>
              </div>
              <div className="me-3">
                <Link
                  className="text-white text-decoration-none linksClass"
                  to="/habitaciones"
                >
                  Habitaciones
                </Link>
              </div>
              <div className="me-3">
                <Link
                  className="text-white text-decoration-none linksClass"
                  to="/clientes"
                >
                  Clientes
                </Link>
              </div>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Outlet />
    </>
  );
}

export default Layout;
