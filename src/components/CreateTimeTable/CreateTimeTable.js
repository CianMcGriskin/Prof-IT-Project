import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import './CreateTimetable.css';


const CreateTimeTable = () => {
  const [userid, setUserid] = useState("");
  const [weekid, setWeekid] = useState("");
  const [timetable, setTimetable] = useState({
    Sunday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Monday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Tuesday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Wednesday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Thursday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Friday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Saturday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false }//The state of the default timetable = empty
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    const day = name.split(".")[0];
    const field = name.split(".")[1];
    const newTimetable = {
      ...timetable,
      [day]: {
        ...timetable[day],
        [field]: value,
        totalHours: calculateTotalHours(day, value, timetable[day].endTime, timetable[day].hasDayOff),
      },
    };
    setTimetable(newTimetable);
    console.log(timetable);
  };

  //Holiday button, hours worked = 0 
  const handleHoliday = (day) => {
    const newTimetable = {
      ...timetable,
      [day]: {
        ...timetable[day],
        startTime: "00:00",
        endTime: "00:00",
        totalHours: 0,
        hasDayOff: true,
      },
    };
    setTimetable(newTimetable);
  };

  // Calculate totat hours worked for the day
  const calculateTotalHours = (day, startTime, endTime, hasDayOff) => {
    if (hasDayOff) return 0;
    if (!startTime || !endTime) return 0;
    const start = new Date(`2001-01-01T${startTime}:00`);
    const end = new Date(`2001-01-01T${endTime}:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : diff + 24;
  };

  const [userInfo, setUserInfo] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/userinfo"); //Fetch user info
      setUserInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };


  useEffect(() => {
    fetchUserInfo();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    //Create timetable to sent out to the DB
    const data = {
      schedule: Object.entries(timetable).map(([day, { startTime, endTime }]) => [
        day,
        new Date(`2001-01-01T${startTime}:00`).toISOString(),
        new Date(`2001-01-01T${endTime}:00`).toISOString(),
        calculateTotalHours(day, startTime, endTime)
      ]),
      userID: userid,
      weekID: weekid
    };
    try {
      const response = await axios.post("http://localhost:4000/api/hours", data); //Send timetable to DB
      console.log(response.data);
      alert("Form submitted successfully!");
    } catch (error) {
      alert("A timetable for this User Id and Week Id already exists, please check your input fields!");
      console.error(error);
    }
  };


  return (
    <div>
      < NavigationBar />
      <div className='container'>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="userid">User ID:</label>
            <input type="text" name="userid" value={userid} onChange={(e) => setUserid(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="weekid">Week ID:</label>
            <input type="text" name="weekid" value={weekid} onChange={(e) => setWeekid(e.target.value)} required />
          </div>
          <div></div>
          <div>
            <label htmlFor="Sunday.startTime">Sunday start time:</label>
            <input type="time" name="Sunday.startTime" value={timetable.Sunday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Sunday.endTime">Sunday end time:</label>
            <input type="time" name="Sunday.endTime" value={timetable.Sunday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Sunday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Sunday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Monday.startTime">Monday start time:</label>
            <input type="time" name="Monday.startTime" value={timetable.Monday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Monday.endTime">Monday end time:</label>
            <input type="time" name="Monday.endTime" value={timetable.Monday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Monday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Monday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Tuesday.startTime">Tuesday start time:</label>
            <input type="time" name="Tuesday.startTime" value={timetable.Tuesday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Tuesday.endTime">Tuesday end time:</label>
            <input type="time" name="Tuesday.endTime" value={timetable.Tuesday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Tuesday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Tuesday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Wednesday.startTime">Wednesday start time:</label>
            <input type="time" name="Wednesday.startTime" value={timetable.Wednesday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Wednesday.endTime">Wednesday end time:</label>
            <input type="time" name="Wednesday.endTime" value={timetable.Wednesday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Wednesday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Wednesday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Thursday.startTime">Thursday start time:</label>
            <input type="time" name="Thursday.startTime" value={timetable.Thursday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Thursday.endTime">Thursday end time:</label>
            <input type="time" name="Thursday.endTime" value={timetable.Thursday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Thursday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Thursday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Friday.startTime">Friday start time:</label>
            <input type="time" name="Friday.startTime" value={timetable.Friday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Friday.endTime">Friday end time:</label>
            <input type="time" name="Friday.endTime" value={timetable.Friday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Friday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Friday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Saturday.startTime">Saturday start time:</label>
            <input type="time" name="Saturday.startTime" value={timetable.Saturday.startTime} onChange={handleChange} str="required" />
            <label htmlFor="Saturday.endTime">Saturday end time:</label>
            <input type="time" name="Saturday.endTime" value={timetable.Saturday.endTime} onChange={handleChange} str="required" />
            <span>Total hours: {timetable.Saturday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Saturday")}>
              Holiday
            </button>
          </div>
          <button type="submit">Submit</button>
        </form>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>User Type</th>
            </tr>
          </thead>
          <tbody>
            {userInfo.map((user) => (
              <tr key={user.userID}>
                <td>{user.userID}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.userType}</td>
              </tr>
            ))}
          </tbody>
        </table>


      </div>
    </div>
  );
};

export default CreateTimeTable;