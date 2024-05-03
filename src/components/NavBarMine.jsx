import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';

export const NavBarMine = () => {


  return (
    <Navbar bg="dark" data-bs-theme="dark" expand="lg" className="bg-body-tertiary">
    <Container>
      <Navbar.Brand href="#home">Modulo compras</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/proveedores">Listado proveedores</Nav.Link>
          <Nav.Link href="/depositivos">Listado depositos</Nav.Link>
          <Nav.Link href="/categorias">Listado categorias</Nav.Link>
          <Nav.Link href="/productos">Listado productos</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>
  )
}
