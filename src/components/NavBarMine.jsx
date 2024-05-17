import React from "react";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";

export const NavBarMine = () => {
  return (
    <Navbar
      bg="dark"
      data-bs-theme="dark"
      expand="lg"
      className="bg-body-tertiary"
    >
      <Container>
        <Navbar.Brand href="/">Modulo compras</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/productTable">ProductTable</Nav.Link>
            <Nav.Link href="/proveedores">Proveedores</Nav.Link>
            <Nav.Link href="/depositos">Depositos</Nav.Link>
            <Nav.Link href="/categorias">Categorias</Nav.Link>
            <Nav.Link href="/productos">Productos</Nav.Link>
            <Nav.Link href="/pedidos">Pedidos</Nav.Link>
            <button>Salir</button>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
