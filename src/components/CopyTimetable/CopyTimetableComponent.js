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
      <center>
      <div>
         <label htmlFor="user-id" class='labelDisplay'>User ID</label>
         <Select
           id="user-id"
           className='selectBox'
           value={selectedUser}
           onChange={setSelectedUser}
           options={userInfo.map((user) => ({ value: user.userID, label: user.userID }))}
         />
       </div>
      <div>
        <label htmlFor="from-week" class='labelDisplay'>From Week</label>
        <Select
          id="from-week"
          className='selectBox'
          value={fromWeek}
          onChange={setFromWeek}
          options={weekOptions}
        />
      </div>
      <div>
        <label htmlFor="to-week" class='labelDisplay'>To Week</label>
        <Select
          id="to-week"
          className='selectBox'
          value={toWeek}
          onChange={setToWeek}
          options={weekOptions}
        />
      </div>
      
        <button id="CopyTimetableButton" onClick={handleCopyTimetable}>Copy Timetable</button>
      </center>
    </div>

        <table id="TableDisplay">
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