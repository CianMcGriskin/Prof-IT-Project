import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar} from 'react-bootstrap';
import LogoutComponent from '../LogoutComponent/LogoutComponent';
import axios from 'axios';

function NavigationBar(){
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/usertype`).then((response) => {
      const userData = response.data;
      if (userData === 'Manager') {
        setIsManager(true);
      }
    });
  });
  
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Grosterota</Navbar.Brand>
          <Nav className="me-auto">
            <Nav.Link href="/timetable">Timetable</Nav.Link>
            {isManager && <Nav.Link>Register Requests</Nav.Link>}
            {isManager && <Nav.Link>Create Timetable</Nav.Link>}
            <Nav.Link as={LogoutComponent}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
