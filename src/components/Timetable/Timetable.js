import NavigationBar from '../Navbar/Navbar'
import axios from 'axios';
import { useState, useEffect } from 'react';

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState("");
  const [hoursData, setHoursData] = useState([]);

  useEffect(() => {
    if (selectedWeek !== "") {
      axios.get(`http://localhost:4000/timetable?weekID=${selectedWeek}`)
      .then(response => {
        const filteredData = response.data.filter(hour => hour.weekID === selectedWeek);
        setHoursData(filteredData);
      })
      .catch(error => {
        console.error(error);
      });
    }
  }, [selectedWeek]);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
  }

  return (
    <div>
      <NavigationBar/>
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
      {hoursData.length > 0 &&
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Start Time</th>
              <th>End Time</th>
              <th>Hours Worked</th>
            </tr>
          </thead>
          <tbody>
            {hoursData.map((hour) => (
              <tr key={hour._id}>
                <td>{hour.schedule[0]}</td>
                <td>{new Date(hour.schedule[1]).toLocaleTimeString()}</td>
                <td>{new Date(hour.schedule[2]).toLocaleTimeString()}</td>
                <td>{hour.schedule[3]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      }
    </div>
  );
};

export default TimetablePage;
