import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Link from 'next/link';

function Navigation() {
  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} href="/">
          🌱 Трекер Растений
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} href="/plants">
              Мои растения
            </Nav.Link>
            <Nav.Link as={Link} href="/add-plant">
              Добавить растение
            </Nav.Link>
            <Nav.Link as={Link} href="/facts">
              Советы и факты
            </Nav.Link>
            <Nav.Link as={Link} href="/suppliers">
              Где купить семена
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default Navigation;