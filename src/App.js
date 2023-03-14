import React from 'react';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage';
import CreateTimeTable from './components/CreateTimeTable/CreateTimeTable';
import RegisterReq from './components/RegisterReq/RegisterReq';
import TimetablePageManager from './components/TimetableManager/TimetableManager'
import logo from './logo.svg';
import './App.css';
import TimetablePage from './components/Timetable/Timetable';

function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage></LoginPage>} />
      <Route path="/register" element={<RegisterPage></RegisterPage>} />
      <Route path="/timetable" element={<TimetablePage></TimetablePage>} />
      <Route path="/CreateTimeTable" element={<CreateTimeTable></CreateTimeTable>} />
      <Route path="/RegisterReq" element={<RegisterReq></RegisterReq>} />
      <Route path="/timetable-manager" element={<TimetablePageManager></TimetablePageManager>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
