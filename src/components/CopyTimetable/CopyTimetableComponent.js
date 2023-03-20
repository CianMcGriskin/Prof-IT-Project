import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import Select from 'react-select';
import { useState, useEffect } from 'react';
import './CopyTimetable.css';

const CopyTimetablePage = () => {
    //Used to select the to and from week for copying the timetable
    const [fromWeek, setFromWeek] = useState(null);
    const [toWeek, setToWeek] = useState(null);

    const [userInfo, setUserInfo] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleCopyTimetable = async () => {
        try {
          await axios.post('http://localhost:4000/api/copy-timetable', { fromWeek, toWeek, selectedUser });
          alert('Timetable copied successfully!');
        } catch (error) {
          alert('Schedule Data Not Found For Selected User and Week');
        }
      };

      const fetchUserInfo = async () => {
        try {
          const response = await axios.get("http://localhost:4000/api/userinfo");
          setUserInfo(response.data);
          setSelectedUser(response.data[0].userID);
        } catch (error) {
          console.error(error);
        }
      };

      function getCurrentWeekID() {
        const today = new Date();
        const firstDayOfYear = new Date(today.getFullYear(), 0, 1);
        const pastDaysOfYear = (today - firstDayOfYear) / 86400000;
        const currentWeekNumber = Math.ceil((pastDaysOfYear + firstDayOfYear.getDay() + 1) / 7);
        return currentWeekNumber;
      }
      

      useEffect(() => {
        fetchUserInfo();
      }, []);

    const weekOptions = [
      { value: '1', label: 'Week 1' },
      { value: '2', label: 'Week 2' },
      { value: '3', label: 'Week 3' },
      { value: '4', label: 'Week 4' },
    ];
    
return(
    <div>
      <NavigationBar />
      <div>
      <h1>Copy Timetable</h1>
      <div>
         <label htmlFor="user-id">User ID:</label>
         <Select
           id="user-id"
           value={selectedUser}
           onChange={setSelectedUser}
           options={userInfo.map((user) => ({ value: user.userID, label: user.userID }))}
         />
       </div>
      <div>
        <label htmlFor="from-week">From Week:</label>
        <Select
          id="from-week"
          value={fromWeek}
          onChange={setFromWeek}
          options={weekOptions}
        />
      </div>
      <div>
        <label htmlFor="to-week">To Week:</label>
        <Select
          id="to-week"
          value={toWeek}
          onChange={setToWeek}
          options={weekOptions}
        />
      </div>
      <button onClick={handleCopyTimetable}>Copy Timetable</button>
    </div>

        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
            </tr>
          </thead>
          <tbody>
            {userInfo.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
              </tr>
            ))}
          </tbody>
        </table>
    </div>
    );
};

export default CopyTimetablePage;