import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../Navbar/Navbar";

const RequestTimeTableModification = () => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  

  const navigate = useNavigate();

  useEffect(() => {
    const fetchTimetables = async () => {
      try {
        const response = await axios.get("http://localhost:4000/timetables");
        setTimetables(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching timetables", error);
      }
    };

    fetchTimetables();
  }, []);

  const calculateHoursDifference = (startTime, endTime) => {
    const start = new Date(startTime);
    const end = new Date(endTime);
    const diff = end - start;
    const hours = diff / (1000 * 60 * 60);
    return hours;
  };


  const handleSelectTimetable = (e) => {
    const timetableId = e.target.value;
    const timetable = timetables.find((tt) => tt.weekID === timetableId);
    setSelectedTimetable(timetable);
  };

  const handleDaySelection = (e) => {
    const day = e.target.value;
    const isSelected = e.target.checked;

    if (isSelected) {
      setSelectedDays([...selectedDays, day]);
    } else {
      setSelectedDays(selectedDays.filter((d) => d !== day));
    }
  };

const handleChange = (e) => {
  const { name, value } = e.target;
  const dayName = name.split(".")[0];
  const field = name.split(".")[1];

  const updatedDay = selectedTimetable.schedule.map((day) => {
    if (day[0] === dayName) {
      let startTime = day[1];
      let endTime = day[2];

      if (field === "startTime") {
        startTime = `2001-01-01T${value}:00`;
      } else if (field === "endTime") {
        endTime = `2001-01-01T${value}:00`;
      }

      let totalHours = 0;

      if (new Date(startTime) >= new Date(endTime)) {
        // Add 24 hours to the end time if the start time is greater than or equal to the end time
        const endTimeNextDay = new Date(endTime);
        endTimeNextDay.setDate(endTimeNextDay.getDate() + 1);
        totalHours = calculateHoursDifference(startTime, endTimeNextDay);
      } else {
        totalHours = calculateHoursDifference(startTime, endTime);
      }

      return [day[0], startTime, endTime, totalHours];
    }
    return day;
  });

  setSelectedTimetable({
    ...selectedTimetable,
    schedule: updatedDay,
  });
};


const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    await axios.post("http://localhost:4000/modify-hours", selectedTimetable);
    alert("Modification request submitted.");
    navigate("/");
  } catch (error) {
    console.error("Error submitting modification request", error);
  }
};


  return (
    <>
      <NavigationBar />
      <h1>Request Timetable Modification</h1>
      <form onSubmit={handleSubmit}>
        <label htmlFor="timetable">Select a timetable:</label>
        <select id="timetable" onChange={handleSelectTimetable}>
          <option value="">--Select a timetable--</option>
          {timetables.map((tt) => (
            <option key={tt.weekID} value={tt.weekID}>
              {`Week ${tt.weekID}`}
            </option>
          ))}
        </select>

        {selectedTimetable && (
          <>
            <h2>Select days for modification:</h2>
            {selectedTimetable.schedule.map((day, index) => (
              <div key={index}>
                <label>
                  <input
                    type="checkbox"
                    value={day[0]}
                    onChange={handleDaySelection}
                  />
                  {day[0]}
                </label>
              </div>
            ))}
          </>
        )}

        {selectedDays.length > 0 && (
          <>
            <h2>Modify the selected days:</h2>
            {selectedDays.map((dayName) => {
              const day = selectedTimetable.schedule.find(
                (d) => d[0] === dayName
              );
              return (
                <div key={dayName}>
                  <h3>{dayName}</h3>
                  <label>
                    Start time:
                    <input
                      type="time"
                      name={`${dayName}.startTime`}
                      value={day[1].slice(11, 16)}
                      onChange={handleChange}
                    />
                  </label>
                  <label>
                    End time:
                    <input
                      type="time"
                      name={`${dayName}.endTime`}
                      value={day[2].slice(11, 16)}
                      onChange={handleChange}
                    />
                  </label>
                </div>
              );
            })}
          </>
        )}

<button type="submit">Submit Request</button>
      </form>
    </>
  );
};

export default RequestTimeTableModification;
