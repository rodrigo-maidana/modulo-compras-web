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
            <NavDropdown title="Gestión" id="inventory-nav-dropdown">
              <NavDropdown.Item href="/proveedores">Proveedores</NavDropdown.Item>
              <NavDropdown.Item href="/depositos">Depositos</NavDropdown.Item>
              <NavDropdown.Item href="/categorias">Categorias</NavDropdown.Item>
              <NavDropdown.Item href="/marcas">Marcas</NavDropdown.Item>
              <NavDropdown.Item href="/productos">Productos</NavDropdown.Item>
            </NavDropdown>

            <Nav.Link href="/pedidos-compra">Pedido compra</Nav.Link>
            <Nav.Link href="/pedidos-cotizacion">Pedido cotizacion</Nav.Link>
            <Nav.Link href="/orden-compra">Orden compra</Nav.Link>
            <Nav.Link href="/facturas">Facturas</Nav.Link>
            <Nav.Link href="/orden-pago">Pagos</Nav.Link>
            <NavDropdown title="Reportes" id="inventory-nav-dropdown">
              <NavDropdown.Item href="/pedidos-pendientes">Pedidos pendientes</NavDropdown.Item>
              <NavDropdown.Item href="/Factura-vencimiento-mes">Facturas a vencer este mes</NavDropdown.Item>
              <NavDropdown.Item href="/Factura-vencimiento-mes-id">Facturas a vencer por Empresa este mes</NavDropdown.Item>
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
