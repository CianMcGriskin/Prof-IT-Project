import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const TimetablePageManager = () => {
    const [selectedWeek, setSelectedWeek] = useState('');
    const [userData, setUserData] = useState([]);
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

    const filteredData = userData.filter(schedule => schedule.weekID === selectedWeek);

return (
    <div>
        <NavigationBar />
      <h1>User Info and Hours</h1>
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
          const filteredHours = hours.filter(hour => hour.weekID === selectedWeek);
          return (
            filteredHours.length > 0 && (
              <tr key={`${firstName}-${lastName}`}>
                <td>{`${firstName} ${lastName}`}</td>
                {filteredHours[0].schedule.map((data, index) => (
                    console.log(data),
                  <td key={index}>
                    {new Date(data[1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(data[2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}
                  </td>
                ))}
              </tr>
            )
          );
        })}

        {/* {userData.map(({ firstName, lastName, hours }) => (
            console.log(hours),
            <tr key={`${firstName}-${lastName}`}>
            <td>{`${firstName} ${lastName}`}</td>
            {hours && hours.length > 0 && (
              <>
                <td>{formatTime(hours[0].schedule[0][1])}</td>
                <td>{new Date(hours[0].schedule[0][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                <td>{new Date(hours[0].schedule[1][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                <td>{new Date(hours[0].schedule[2][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                <td>{new Date(hours[0].schedule[3][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                <td>{new Date(hours[0].schedule[4][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
                <td>{new Date(hours[0].schedule[5][1]).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })} - {new Date(hours[0].schedule[0][2]).toLocaleTimeString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true })}</td>
              </>
              
            )}
            </tr>
        ))} */}
        </tbody>
      </table>
    </div>
  );
};

// helper function to get the hours for a given day
function formatTime(time) {
    return new Date(time).toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true });
  }

export default TimetablePageManager;