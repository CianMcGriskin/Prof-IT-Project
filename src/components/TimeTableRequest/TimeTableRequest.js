import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import NavigationBar from "../Navbar/Navbar";

const RequestTimeTableModification = () => {
  const [timetables, setTimetables] = useState([]);
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [selectedDays, setSelectedDays] = useState([]);
  const [totalHours, setTotalHours] = useState({});
  const [userID, setUserID] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserID = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/userid", {
          withCredentials: true,
        });
        setUserID(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching user ID", error);
      }
    };

    fetchUserID();
  }, []);

  useEffect(() => {
    if (userID) {
      const fetchTimetables = async () => {
        try {
          const response = await axios.get("http://localhost:4000/timetables", {
            withCredentials: true,
          });
          const userTimetables = response.data.filter(
            (tt) => tt.userID === userID
          );
          console.log(userTimetables);
          setTimetables(userTimetables);
        } catch (error) {
          console.error("Error fetching timetables", error);
        }
      };

      fetchTimetables();
    }
  }, [userID]);

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
    const startTime = field === "startTime" ? `2001-01-01T${value}:00` : null;
    const endTime = field === "endTime" ? `2001-01-01T${value}:00` : null;

    const updatedDay = selectedTimetable.schedule.map((day) => {
      if (day[0] === dayName) {
        const start = startTime ? new Date(startTime) : new Date(day[1]);
        const end = endTime ? new Date(endTime) : new Date(day[2]);
        const diffInMs = end - start;
        const hours = diffInMs / 1000 / 60 / 60;
        setTotalHours({
          ...totalHours,
          [dayName]: hours.toFixed(2),
        });
        return [day[0], startTime || day[1], endTime || day[2], day[3]];
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
      const modifiedDays = selectedTimetable.schedule.map(day => {
        if (selectedDays.includes(day[0])) {
          // Calculate total hours worked for modified days
          const start = new Date(day[1]);
          const end = new Date(day[2]);
          const total = (end.getTime() - start.getTime()) / (1000 * 60 * 60);
          return [day[0], day[1], day[2], total];
        } else {
          // Use original total hours worked for unmodified days
          return day;
        }
      });
  
      const modifiedHoursData = {
        schedule: modifiedDays,
        userID: selectedTimetable.userID,
        weekID: selectedTimetable.weekID,
      };
  
      console.log(modifiedHoursData);
  
      await axios.post("http://localhost:4000/modify-hours", modifiedHoursData, {
        withCredentials: true,
      });
      // Show success message or perform additional actions on successful save
    } catch (error) {
      console.error("Error saving modified hours", error);
      // Show error message or perform additional actions on error
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
                  {totalHours[dayName] && (
                    <p>Total hours worked: {totalHours[dayName]}</p>
                  )}
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
