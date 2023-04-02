import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TimetablePageManager = () => {
    const [selectedWeek, setSelectedWeek] = useState('');
    const [userData, setUserData] = useState([]);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(getCurrentWeekID());
    const hasAuthCookie = Cookies.get('Auth');
    if (!hasAuthCookie) 
        window.location.href = '/';
    

    useEffect(() => {
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:4000/manager-timetable');
              setUserData(response.data);
              //console.log(response.data)
            } catch (error) {
              console.error(error);
            }
        };
        fetchData();
    }, []);

    const handleWeekChange = (event) => {
        setSelectedWeek(event.target.value);
      };

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
    const filteredData = userData.filter(schedule => schedule.weekID === weeks[selectedWeekIndex-1].toString());

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
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Sunday</th>
            <th>Monday</th>
            <th>Tuesday</th>
            <th>Wednesday</th>
            <th>Thursday</th>
            <th>Friday</th>
            <th>Saturday</th>
          </tr>
        </thead>
        <tbody>
        {userData.map(({ firstName, lastName, hours }) => {
          const filteredHours = hours.filter(hour => hour.weekID === weeks[selectedWeekIndex-1].toString());
          return (
            filteredHours.length > 0 && (
              <tr key={`${firstName}-${lastName}`}>
                <td>{`${firstName} ${lastName}`}</td>
                {filteredHours[0].schedule.map((data, index) => (
                  <td key={index}>
                    {new Date(data[1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(data[2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </td>
                ))}
              </tr>
            )
          );
        })}
        </tbody>
      </table>
      <center>
        <button onClick={() => {window.location.href='/copytimetable'}}>Copy Timetable</button>
      </center>
    </div>
  );
};

// helper function to get the hours for a given day
function formatTime(time) {
    return new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

export default TimetablePageManager;