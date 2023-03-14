import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Nav, Navbar} from 'react-bootstrap';
import LogoutComponent from '../LogoutComponent/LogoutComponent';
import axios from 'axios';

function NavigationBar(){
  const [isManager, setIsManager] = useState(false);

  useEffect(() => {
    axios.get(`http://localhost:4000/api/usertype`, {withCredentials: true}).then((response) => {
      const userData = response.data;
      console.log(userData);
      if (userData === 'Manager') {
        setIsManager(true);
      }
    });
  });

  const cookies = document.cookie.split(';');
const cookieMap = {};
cookies.forEach(cookie => {
  const parts = cookie.split('=');
  cookieMap[parts[0].trim()] = parts[1].trim();
});
const authCookie = cookieMap.Auth;
  
  return (
    <>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Grosterota</Navbar.Brand>
          <Nav className="me-auto">
            {!isManager && <Nav.Link href="/timetable">Timetable</Nav.Link>}
            {isManager && <Nav.Link href="/timetable-manager">Timetable</Nav.Link>}
            {isManager && <Nav.Link href="CreateTimeTable">Create Timetable</Nav.Link>}
            {isManager && <Nav.Link href="RegisterReq">Register Requests</Nav.Link>}
            
            <Nav.Link as={LogoutComponent}>Logout</Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default NavigationBar;
