import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import './Timetable.css'

let timeFormat = "'en-US', { hour: 'numeric', minute: 'numeric', hour12: true }";

const TimetablePage = () => {
  const [selectedWeek, setSelectedWeek] = useState('');
  const [scheduleData, setScheduleData] = useState([]);
  const [selectedWeekIndex, setSelectedWeekIndex] = useState(getCurrentWeekID());

  const hasAuthCookie = Cookies.get('Auth');
  if (!hasAuthCookie) {
    window.location.href = '/';
  }

  useEffect(() => {
    axios
      .get(`http://localhost:4000/timetable`)
      .then((response) => {
        setScheduleData(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  function getCurrentWeekID() {
    const today = new Date();
    const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
    const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
    const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
    return currentWeekNumber;
  }

  function handleClick(direction) {
    setSelectedWeekIndex((prevIndex) => {
      if (direction === 'left') {
        return prevIndex > 0 ? prevIndex - 1 : prevIndex;
      } else if (direction === 'right') {
        return prevIndex < 51 ? prevIndex + 1 : prevIndex;
      } else {
        return prevIndex;
      }
    });
  }

  const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

  const filteredData = scheduleData.filter(schedule => schedule.weekID === weeks[selectedWeekIndex-1].toString());
  return (
    <div>
      <NavigationBar />
      <div className="scroller">
        <button className="arrow" onClick={() => handleClick('left')}>&#60;</button>
        <div className="week gray left">{selectedWeekIndex > 0 ? weeks[selectedWeekIndex - 2] : '--'}</div>
        <div className="week selected">{weeks[selectedWeekIndex-1]}</div>
        <div className="week gray right">{selectedWeekIndex < 51 ? weeks[selectedWeekIndex] : '--'}</div>
        <button className="arrow" onClick={() => handleClick('right')}>&#62;</button>
      </div>

      {weeks[selectedWeekIndex-1] && (
        <div>
            {filteredData.map((schedule, index) => (
              <div key={index}>
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
                    {schedule.schedule.map((data, index) => (
                      <tr key={index}>
                        <td>{data[0]}</td>
                        <td>{new Date(data[1]).toLocaleTimeString()}</td>
                        <td>{new Date(data[2]).toLocaleTimeString()}</td>
                        <td>{data[3].toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            
          ))}
        </div>
      )}
    </div>
  );
};



export default TimetablePage;
