import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeTableSchedule = ()=> {
  const [selectedTimetable, setSelectedTimetable] = useState(null); // set initial value of selectedTimetable to null
  const [timetables, setTimetables] = useState([]);
  const [timetable, setTimetable] = useState({ // change selectedTimetable to timetable
    Sunday: { startTime: "", endTime: "", totalHours: 0 },
    Monday: { startTime: "", endTime: "", totalHours: 0 },
    Tuesday: { startTime: "", endTime: "", totalHours: 0 },
    Wednesday: { startTime: "", endTime: "", totalHours: 0 },
    Thursday: { startTime: "", endTime: "", totalHours: 0 },
    Friday: { startTime: "", endTime: "", totalHours: 0 },
    Saturday: { startTime: "", endTime: "", totalHours: 0 }
  });

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get("http://localhost:4000/timetables");
        setTimetables(response.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchTimetables();
  }, []);

  const handleChange = async (e) => {
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
    console.log(timetable);
    try {
      await axios.put(`http://localhost:4000/timetables/${selectedTimetable.id}`, newTimetable);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTimetableSelect = (event) => {
    const selectedValue = event.target.value;
    const selectedTimetable = timetables.find(
      (timetable) => timetable.weekID === selectedValue
    );
    setSelectedTimetable(selectedTimetable);
  
    // Populate input fields with selected timetable data
    setTimetable({
      Sunday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Sunday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Sunday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Sunday', selectedTimetable.schedule.find((entry) => entry[0] === 'Sunday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Sunday')[2].slice(11, 16))
      },
      Monday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Monday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Monday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Monday', selectedTimetable.schedule.find((entry) => entry[0] === 'Monday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Monday')[2].slice(11, 16))
      },
      Tuesday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Tuesday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Tuesday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Tuesday', selectedTimetable.schedule.find((entry) => entry[0] === 'Tuesday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Tuesday')[2].slice(11, 16))
      },
      Wednesday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Wednesday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Wednesday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Wednesday', selectedTimetable.schedule.find((entry) => entry[0] === 'Wednesday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Wednesday')[2].slice(11, 16))
      },
      Thursday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Thursday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Thursday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Thursday', selectedTimetable.schedule.find((entry) => entry[0] === 'Thursday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Thursday')[2].slice(11, 16))
      },
      Friday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Friday')[1].slice(11, 16),endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Friday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Friday', selectedTimetable.schedule.find((entry) => entry[0] === 'Friday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Friday')[2].slice(11, 16))
        },
        Saturday: {
        startTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Saturday')[1].slice(11, 16),
        endTime: selectedTimetable.schedule.find((entry) => entry[0] === 'Saturday')[2].slice(11, 16),
        totalHours: calculateTotalHours('Saturday', selectedTimetable.schedule.find((entry) => entry[0] === 'Saturday')[1].slice(11, 16), selectedTimetable.schedule.find((entry) => entry[0] === 'Saturday')[2].slice(11, 16))
        }
        });
        };
  

  const calculateTotalHours = (day, startTime, endTime) => {
    if (!startTime || !endTime) return 0;
    const start = new Date(`2001-01-01T${startTime}:00`);
    const end = new Date(`2001-01-01T${endTime}:00`);
    const diff = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
    return diff > 0 ? diff : diff + 24;
  };


  const handleTimetableUpdate = async () => {
    console.log(selectedTimetable.schedule);
    try {
     
      await axios.put(
        `http://localhost:4000/timetables/${selectedTimetable._id}`,
        {
          schedule: selectedTimetable.schedule,
          
        }
 
      );
      alert("Timetable updated successfully!");
    } catch (error) {
      console.error(error);
      alert("Failed to update timetable.");
    }
  };

  const handleSubmit = (event) => { // define handleSubmit function
    event.preventDefault();
    console.log(timetable); // log the timetable object to console
  };

  return (
    <div>
      <h1>Choose a timetable</h1>
      <select onChange={handleTimetableSelect}>
        <option value="">Select a timetable</option>
        {timetables.map((timetable) => (
          <option key={timetable._id} value={timetable.weekID}>
            {timetable.weekID}
          </option>
        ))}
      </select>
      {selectedTimetable && (
        <div>
          <h2>Editing Timetable: {selectedTimetable.weekID}</h2>
          <form onSubmit={handleSubmit}>
            <table>
              <thead>
                <tr>
                  <th>Day</th>
                  <th>Start Time</th>
                  <th>End Time</th>
                  <th>Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(timetable).map(([day, { startTime, endTime, totalHours }]) => (
                  <tr key={day}>
                    <td>{day}</td>
                    <td>
                      <input
                        type="time"
                        name={`${day}.startTime`}
                        value={startTime}
                        onChange={handleChange}
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        name={`${day}.endTime`}
                        value={endTime}
                        onChange={handleChange}
                      />
                    </td>
                    <td>{totalHours}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </form>
          <button type="submit" onClick={handleTimetableUpdate}>Update Timetable</button>
        </div>
      )}
    </div>
  );
};
export default TimeTableSchedule;
