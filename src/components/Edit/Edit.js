import NavigationBar from "../Navbar/Navbar";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";

const Edit = () => {
  const [timetables, setTimetables] = useState([]); //Store timetable to empty array
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [userid, setUserid] = useState(""); // Store userid
  const [weekid, setWeekid] = useState(""); // Store weekid
  const [timetable, setTimetable] = useState({
    // Set the timetaable with defualt values
    Sunday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Monday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Tuesday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Wednesday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Thursday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Friday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
    Saturday: { startTime: "", endTime: "", totalHours: 0, hasDayOff: false },
  });

  const hasAuthCookie = Cookies.get("Auth");
  if (!hasAuthCookie) {
    window.location.href = "/";
  }

  const [userInfo, setUserInfo] = useState([]);

  const fetchUserInfo = async () => {
    try {
      const response = await axios.get("http://localhost:4000/api/userinfo"); // Retrieve user info
      setUserInfo(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Function to create a holdiay (User worked 0 hours)
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
    setTimetable(newTimetable); // Update timetable with holdiay
  };

  useEffect(() => {
    fetchUserInfo();
  }, []);

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get("http://localhost:4000/timetables");// Get current timetables from server
        setTimetables(response.data);
      } catch (error) {
        console.error("Error fetching timetables", error);
      }
    };
    fetchTimetables();
  }, []);

  const handleChange = (e) => {
    // Extract the name and value properties from the event target
    const { name, value } = e.target;
    const day = name.split(".")[0];
    const field = name.split(".")[1];
    // When timetable is changed then change the values to that timetable
    const newTimetable = {
      ...timetable,
      [day]: {
        ...timetable[day],
        [field]: value,
        totalHours: calculateTotalHours(day, value, timetable[day].endTime),
      },
    };
    setTimetable(newTimetable);
  };

  // Calculates hours difference between each day
  const calculateTotalHours = (day, startTime, endTime, hasDayOff) => {
    // If the days is marked off then 0 hours are worked
    if (hasDayOff) return 0;
    // If the start time or end time is missing, 0 hours are worked
    if (!startTime || !endTime) return 0;
    const start = new Date(`2001-01-01T${startTime}:00`);
    const end = new Date(`2001-01-01T${endTime}:00`);
    // Calculate the difference between start and end times
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    // If  the difference is positive then return it otherwise add 24 h and then return
    return diff > 0 ? diff : diff + 24;
  };

//Handles changing the selected timetable
  const handleSelectTimetable = (e) => {
    // Get the selected timetable's ID
    const selectedId = e.target.value;
    if (selectedId) {
      const selected = timetables.find((t) => t._id === selectedId);
      setSelectedTimetable(selected);

      // Create a new timetable when the selected timetable changes
      const newTimetable = {};
      selected.schedule.forEach(([day, startTime, endTime]) => {
        newTimetable[day] = {
          startTime: startTime.slice(11, 16),
          endTime: endTime.slice(11, 16),
          totalHours: calculateTotalHours(
            day,
            startTime.slice(11, 16),
            endTime.slice(11, 16)
          ),
        };
      });
      // Update the timetable with new timetable 
      setTimetable(newTimetable);
    } else {
      // Default values when no timetable is selected
      setSelectedTimetable(null);
      setTimetable({
        Sunday: { startTime: "", endTime: "", totalHours: 0 },
        Monday: { startTime: "", endTime: "", totalHours: 0 },
        Tuesday: { startTime: "", endTime: "", totalHours: 0 },
        Wednesday: { startTime: "", endTime: "", totalHours: 0 },
        Thursday: { startTime: "", endTime: "", totalHours: 0 },
        Friday: { startTime: "", endTime: "", totalHours: 0 },
        Saturday: { startTime: "", endTime: "", totalHours: 0 },
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Create a new schedule array from the timetable state
    const schedule = Object.entries(timetable).map(
      ([day, { startTime, endTime, totalHours }]) => [
        day,
        `2001-01-01T${startTime}:00`,
        `2001-01-01T${endTime}:00`,
        totalHours,
      ]
    );
    
    if (selectedTimetable) {
      try {
        await axios.put(
          `http://localhost:4000/timetables/${selectedTimetable._id}`, //Send new timetable to DB
          {
            schedule,
          }
        );
        alert("Timetable updated successfully");
      } catch (error) {
        console.error("Error updating timetable", error);
      }
    }
  };

  return (
    <>
      <NavigationBar />
      <div className="container">
        <h1>Create TimeTable</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="timetableSelect">Select Timetable</label>
            <select
              className="form-control"
              id="timetableSelect"
              value={selectedTimetable?._id || ""}
              onChange={handleSelectTimetable}
            >
              <option value="">--Select a timetable--</option>
              {timetables.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.weekID} - User {t.userID}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="Sunday.startTime">Sunday start time:</label>
            <input
              type="time"
              name="Sunday.startTime"
              value={timetable.Sunday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Sunday.endTime">Sunday end time:</label>
            <input
              type="time"
              name="Sunday.endTime"
              value={timetable.Sunday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>Total hours: {timetable.Sunday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Sunday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Monday.startTime">Monday start time:</label>
            <input
              type="time"
              name="Monday.startTime"
              value={timetable.Monday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Monday.endTime">Monday end time:</label>
            <input
              type="time"
              name="Monday.endTime"
              value={timetable.Monday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>Total hours: {timetable.Monday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Monday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Tuesday.startTime">Tuesday start time:</label>
            <input
              type="time"
              name="Tuesday.startTime"
              value={timetable.Tuesday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Tuesday.endTime">Tuesday end time:</label>
            <input
              type="time"
              name="Tuesday.endTime"
              value={timetable.Tuesday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>Total hours: {timetable.Tuesday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Tuesday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Wednesday.startTime">Wednesday start time:</label>
            <input
              type="time"
              name="Wednesday.startTime"
              value={timetable.Wednesday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Wednesday.endTime">Wednesday end time:</label>
            <input
              type="time"
              name="Wednesday.endTime"
              value={timetable.Wednesday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>
              Total hours: {timetable.Wednesday.totalHours.toFixed(2)}
            </span>
            <button type="button" onClick={() => handleHoliday("Wednesday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Thursday.startTime">Thursday start time:</label>
            <input
              type="time"
              name="Thursday.startTime"
              value={timetable.Thursday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Thursday.endTime">Thursday end time:</label>
            <input
              type="time"
              name="Thursday.endTime"
              value={timetable.Thursday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>Total hours: {timetable.Thursday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Thursday")}>
              Holiday
            </button>
          </div>

          <div>
            <label htmlFor="Friday.startTime">Friday start time:</label>
            <input
              type="time"
              name="Friday.startTime"
              value={timetable.Friday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Friday.endTime">Friday end time:</label>
            <input
              type="time"
              name="Friday.endTime"
              value={timetable.Friday.endTime}
              onChange={handleChange}
              str="required"
            />
            <span>Total hours: {timetable.Friday.totalHours.toFixed(2)}</span>
            <button type="button" onClick={() => handleHoliday("Friday")}>
              Holiday
            </button>
          </div>
          <div>
            <label htmlFor="Saturday.startTime">Saturday start time:</label>
            <input
              type="time"
              name="Saturday.startTime"
              value={timetable.Saturday.startTime}
              onChange={handleChange}
              str="required"
            />
            <label htmlFor="Saturday.endTime">Saturday end time:</label>
            <input
              type="time"
              name="Saturday.endTime"
              value={timetable.Saturday.endTime}
              onChange={handleChange}
              str="required"
            />
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
            {/*Print the user info at the bottom*/}
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
    </>
  );
};

export default Edit;
