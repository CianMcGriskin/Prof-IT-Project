import React from 'react';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage';
import CreateTimeTable from './components/CreateTimeTable/CreateTimeTable';
import RegisterReq from './components/RegisterReq/RegisterReq';
import TimetablePageManager from './components/TimetableManager/TimetableManager'
import Edit from './components/Edit/Edit';
import TimeTableRequest from './components/TimeTableRequest/TimeTableRequest';
import Approve from './components/TimeTableRequest/Approve';
import logo from './logo.svg';
import './App.css';
import TimetablePage from './components/Timetable/Timetable';
import CopyTimetablePage from './components/CopyTimetable/CopyTimetableComponent';

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
      <Route path="/Edit" element={<Edit></Edit>} />
      <Route path="/TimeTableRequest" element={<TimeTableRequest></TimeTableRequest>} />
      <Route path="/Approve" element={<Approve></Approve>} />
      <Route path="/CopyTimetable" element={<CopyTimetablePage></CopyTimetablePage>} />
    </Routes>
  </BrowserRouter>
  );
}

export default App;
