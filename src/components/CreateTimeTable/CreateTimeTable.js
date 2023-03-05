import React, { useState } from "react";
import axios from 'axios';
import { Link } from "react-router-dom";


const CreateTimeTable = () => {
    const [timetable, setTimetable] = useState({
      sunday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      monday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      tuesday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      wednesday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      thursday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      friday: { id: '', startTime: '', endTime: '', totalHours: 0 },
      saturday: { id: '', startTime: '', endTime: '', totalHours: 0 },
    });
    const [userid, setUserid] = useState('');
    const [weekid, setWeekid] = useState('');

    const handleChange = (event) => {
      const { name, value } = event.target;
      const [day, field] = name.split('.');
      const newTimetable = { ...timetable };
      newTimetable[day][field] = value;
      if (field === 'startTime' || field === 'endTime') {
        const startTime = new Date(`1970-01-01T${newTimetable[day].startTime}:00Z`);
        const endTime = new Date(`1970-01-01T${newTimetable[day].endTime}:00Z`);
        newTimetable[day].totalHours = (endTime - startTime) / 1000 / 60 / 60;
      }
      setTimetable(newTimetable);
    };
  
    const handleSubmit = (event) => {
      event.preventDefault();
      axios.post('http://localhost:4000/submit-schedule', { timetable })
        .then(response => {
          console.log(response.data);
        })
        .catch(error => {
          console.log(error);
        });
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
