import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [hoursData, setHoursData] = useState([]);

  const hasAuthCookie = Cookies.get('Auth');
  if (!hasAuthCookie) {
    window.location.href = '/';
  }

  useEffect(() => {
    axios
      .get(`http://localhost:4000/timetable`)
      .then((response) => {
        setHoursData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  };

  const filteredData =
    selectedWeek !== ''
      ? hoursData.filter((hours) => hours.weekID === selectedWeek)
      : [];

  return (
    <div>
      <NavigationBar />
      <div>
        <label htmlFor="week-select">Select Week:</label>
        <select id="week-select" value={selectedWeek} onChange={handleWeekChange}>
          <option value="">--Select a week--</option>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          {/* Add more options as needed */}
        </select>
      </div>
      {filteredData.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Week</th>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
          {filteredData.map((hour) => (
  <tr key={hour._id}>
    <td>{hour.weekID}</td>
    <td>{hour.schedule[0]}</td>
    <td>{new Date(hour.schedule[1]).toLocaleTimeString()}</td>
    <td>{new Date(hour.schedule[2]).toLocaleTimeString()}</td>
    <td>{hour.schedule[3]}</td>
  </tr>
))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TimetablePage;
