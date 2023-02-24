import React from 'react';
import { BrowserRouter, Route, Link, Routes } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage'
import RegisterPage from './components/RegisterPage/RegisterPage';
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
  </Routes>
  
  </BrowserRouter>
  );
}

export default App;
