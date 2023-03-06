import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";


const CreateTimeTable = () => {
  const [userid, setUserid] = useState("");
  const [weekid, setWeekid] = useState("");
  const [timetable, setTimetable] = useState({
    sunday: { startTime: "", endTime: "", totalHours: 0 },
    monday: { startTime: "", endTime: "", totalHours: 0 },
    tuesday: { startTime: "", endTime: "", totalHours: 0 },
    wednesday: { startTime: "", endTime: "", totalHours: 0 },
    thursday: { startTime: "", endTime: "", totalHours: 0 },
    friday: { startTime: "", endTime: "", totalHours: 0 },
    saturday: { startTime: "", endTime: "", totalHours: 0 }
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
        totalHours: calculateTotalHours(day, value, timetable[day].endTime)
      }
    };
    setTimetable(newTimetable);
  };

  const calculateTotalHours = (day, startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2001-01-01T${startTime}:00`);
    const end = new Date(`2001-01-01T${endTime}:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : diff + 24;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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
      const response = await axios.post("http://localhost:4000/api/hours", data);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
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
        <label htmlFor="sunday.startTime">Sunday start time:</label>
        <input type="time" name="sunday.startTime" value={timetable.sunday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="sunday.endTime">Sunday end time:</label>
        <input type="time" name="sunday.endTime" value={timetable.sunday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.sunday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="monday.startTime">Monday start time:</label>
        <input type="time" name="monday.startTime" value={timetable.monday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="monday.endTime">Monday end time:</label>
        <input type="time" name="monday.endTime" value={timetable.monday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.monday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="tuesday.startTime">Tuesday start time:</label>
        <input type="time" name="tuesday.startTime" value={timetable.tuesday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="tuesday.endTime">Tuesday end time:</label>
        <input type="time" name="tuesday.endTime" value={timetable.tuesday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.tuesday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="wednesday.startTime">wednesday start time:</label>
        <input type="time" name="wednesday.startTime" value={timetable.wednesday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="wednesday.endTime">Wednesday end time:</label>
        <input type="time" name="wednesday.endTime" value={timetable.wednesday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.wednesday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="thursday.startTime">Thursday start time:</label>
        <input type="time" name="thursday.startTime" value={timetable.thursday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="thursday.endTime">Thursday end time:</label>
        <input type="time" name="thursday.endTime" value={timetable.thursday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.thursday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="friday.startTime">Friday start time:</label>
        <input type="time" name="friday.startTime" value={timetable.friday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="friday.endTime">Friday end time:</label>
        <input type="time" name="friday.endTime" value={timetable.friday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.friday.totalHours.toFixed(2)}</span>
      </div>
      <div>
        <label htmlFor="saturday.startTime">Saturday start time:</label>
        <input type="time" name="saturday.startTime" value={timetable.saturday.startTime} onChange={handleChange} str="required" />
        <label htmlFor="saturday.endTime">Saturday end time:</label>
        <input type="time" name="saturday.endTime" value={timetable.saturday.endTime} onChange={handleChange} str="required" />
        <span>Total hours: {timetable.saturday.totalHours.toFixed(2)}</span>
      </div>
      <button type="submit">Submit</button>
            </form>
  );
};

export default CreateTimeTable;
