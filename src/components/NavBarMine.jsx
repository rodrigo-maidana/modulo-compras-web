import React, { useContext } from "react";
import { Container, Nav, Navbar, NavDropdown } from "react-bootstrap";
import { AuthContext } from "./AuthContext";

export const NavBarMine = () => {
  const { logout } = useContext(AuthContext);

  return (
    <Navbar
      bg="dark"
      expand="lg"
      className="bg-body-tertiary"
      data-bs-theme="dark"
    >
      <Container fluid>
        <Navbar.Brand href="/">Modulo compras</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/proveedores">Proveedores</Nav.Link>
            <Nav.Link href="/depositos">Depositos</Nav.Link>
            <Nav.Link href="/categorias">Categorias</Nav.Link>
            <Nav.Link href="/productos">Productos</Nav.Link>
            <Nav.Link href="/pedidos">Pedidos</Nav.Link>
            <NavDropdown title="Pedido Cotizacion" id="basic-nav-dropdown">
              <NavDropdown.Item href="/pedido-cotizacion">
                Listado
              </NavDropdown.Item>
              <NavDropdown.Item href="/pedido-cotizacion/nuevo">
                Nuevo
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav className="ms-auto me-3">
            <button onClick={logout} className="btn btn-outline-light">
              Salir
            </button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
