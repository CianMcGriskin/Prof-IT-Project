import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

// Component named 'TimetablePageManager'
const TimetablePageManager = () => { 
    const [userData, setUserData] = useState([]);
    const [selectedWeekIndex, setSelectedWeekIndex] = useState(getCurrentWeekID());
    const hasAuthCookie = Cookies.get('Auth');

    // if 'hasAuthCookie' is false, redirect to home page, sued for security reasons
    if (!hasAuthCookie) 
        window.location.href = '/';
    
    // useEffect hook is used to fetch data
    useEffect(() => { 
        const fetchData = async () => {
            try {
              const response = await axios.get('http://localhost:4000/manager-timetable');
              setUserData(response.data); // update the 'userData' state with the data received from the server
            } catch (error) {
              console.log(error);
            }
        };
        fetchData(); // call the 'fetchData' function
    }, []);

    function getCurrentWeekID() {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1); // create a new Date object representing the first day of the year and assign it to 'firstDayOfYear'
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000; // calculate the number of past days in the year and assign it to 'pastDaysOfYear'
        const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7); // calculate the current week number and assign it to 'currentWeekNumber'
        return currentWeekNumber;
      }

      function handleClick(direction) {
        setSelectedWeekIndex((prevIndex) => {
          if (direction === 'left') {
            return prevIndex > 1 ? prevIndex - 1 : 1; // if the direction is 'left', decrease the 'selectedWeekIndex' by 1 if it's greater than 1, otherwise return 1
          } else if (direction === 'right') {
            return prevIndex < 51 ? prevIndex + 1 : prevIndex; // if the direction is 'right', increase the 'selectedWeekIndex' by 1 if it's less than 51, otherwise return the previous value
          } else {
            return prevIndex; // if the direction is not 'left' or 'right', return the value
          }
        });
      }

    const weeks = Array.from({ length: 52 }, (_, i) => i + 1);

return (
    <div>
        <NavigationBar />
        <div className="scroller">
        {/* Render button with onClick function to handle moving left */}
        <button className="arrow" onClick={() => handleClick('left')}>&#60;</button>
        {/* Render div to display selected week and surrounding weeks */}
        <div className="week gray left">{selectedWeekIndex > 0 ? weeks[selectedWeekIndex - 2] : '--'}</div>
        <div className="week selected">{weeks[selectedWeekIndex-1]}</div>
        <div className="week gray right">{selectedWeekIndex < 51 ? weeks[selectedWeekIndex] : '--'}</div>
        {/* Render button with onClick function to handle moving right */}
        <button className="arrow" onClick={() => handleClick('right')}>&#62;</button>
      </div>
      <table>
        <thead>
          <tr>
            {/* Render table headers */}
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
          // Filter the hours for the currently selected week
          const filteredHours = hours.filter(hour => hour.weekID === weeks[selectedWeekIndex-1].toString());
          
          return (
            // Only render table row if the employee has hours scheduled for the selected week
            filteredHours.length > 0 && (
              <tr key={`${firstName}-${lastName}`}>
                {/* Render employee name */}
                <td>{`${firstName} ${lastName}`}</td>
                {/* Render each scheduled shift for the employee */}
                {filteredHours[0].schedule.map((data, index) => {
                  console.log(data);
                  const startTime = new Date(data[1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                  const endTime = new Date(data[2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
                  return (
                    <td key={index}>
                    {/* If the shift is an all-day shift, display "Day Off", otherwise display the shift start and end times */}
                    {startTime === '12:00 AM' && endTime === '12:00 AM'
                      ? 'Day Off'
                      : `${startTime} - ${endTime}`}
                  </td>
                  )
                })}
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
export default TimetablePageManager;