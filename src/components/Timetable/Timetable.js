import NavigationBar from '../Navbar/Navbar'
import axios from 'axios';
import { useState } from 'react';

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState("1"); // default to week 1
  const [timetable, setTimetable] = useState(null);

  const handleWeekChange = (event) => {
    setSelectedWeek(event.target.value);
    axios.get(`http://localhost:4000/timetable/${event.target.value}`)
      .then(response => {
        setTimetable(response.data);
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div>
      <NavigationBar/>
      <div>
        <label htmlFor="week-select">Select week:</label>
        <select id="week-select" value={selectedWeek} onChange={handleWeekChange}>
          <option value="1">Week 1</option>
          <option value="2">Week 2</option>
          <option value="3">Week 3</option>
          {/* Add more options for additional weeks */}
        </select>
      </div>
      {timetable ? (
        <div>
          {/* Log the timetable data */}
          {console.log(timetable)}
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Start time</th>
                <th>End time</th>
                <th>Hours</th>
              </tr>
            </thead>
            <tbody>
              {timetable.schedule.map((entry, index) => (
                <tr key={index}>
                  <td>{entry[0]}</td>
                  <td>{entry[1]}</td>
                  <td>{entry[2]}</td>
                  <td>{entry[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p>Select a week to view timetable</p>
      )}
    </div>
  );
  
};

export default TimetablePage;
