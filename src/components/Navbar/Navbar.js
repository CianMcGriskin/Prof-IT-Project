import React from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar} from 'react-bootstrap';
import LogoutComponent from '../LogoutComponent/LogoutComponent';

function NavigationBar(){
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Grosterota</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/timetable">Timetable</Nav.Link>
            <Nav.Link as={LogoutComponent}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
