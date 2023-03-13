import React, { useState, useEffect } from "react";
import axios from "axios";

const TimeTableSchedule = () => {
  const [selectedTimetable, setSelectedTimetable] = useState(null);
  const [timetables, setTimetables] = useState([]);

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

  const handleTimetableSelect = (event) => {
    const selectedValue = event.target.value;
    const selectedTimetable = timetables.find(
      (timetable) => timetable.weekID === selectedValue
    );
    setSelectedTimetable(selectedTimetable);
  };

  const handleScheduleEntryChange = (day, property, value) => {
    const updatedSchedule = selectedTimetable.schedule.map((entry) => {
      if (entry[0] === day) {
        return [day, value.toISOString(), entry[2], entry[3]];
      }
      return entry;
    });
    setSelectedTimetable({ ...selectedTimetable, schedule: updatedSchedule });
  };

  const handleTimetableUpdate = async () => {
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

  return (
    <div>
      <h1>Choose a timetable:</h1>
      <select onChange={handleTimetableSelect}>
        <option value="">Select a timetable</option>
        {timetables.map((timetable) => (
          <option key={timetable.weekID} value={timetable.weekID}>
            {timetable.weekID}
          </option>
        ))}
      </select>

      {selectedTimetable && (
        <div>
          <h2>{selectedTimetable.weekID}</h2>
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Start Time</th>
                <th>End Time</th>
                <th>Duration</th>
              </tr>
            </thead>
            <tbody>
              {selectedTimetable.schedule.map((entry, index) => {
                const startTime = new Date(entry[1])
                  .toISOString()
                  .substr(11, 5);
                const endTime = new Date(entry[2]).toISOString().substr(11, 5);
                return (
                  <tr key={entry[0] + index}>
                    <td>{entry[0]}</td>
                    <td>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(event) =>
                          handleScheduleEntryChange(
                            entry[0],
                            1,
                            new Date(`2001-01-01T${event.target.value}:00`)
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(event) =>
                          handleScheduleEntryChange(
                            entry[0],
                            2,
                            new Date(`2001-01-01T${event.target.value}:00`)
                          )
                        }
                      />
                    </td>
                    <td>{entry[3]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <button onClick={handleTimetableUpdate}>Update Timetable</button>
        </div>
      )}
    </div>
  );
};

export default TimeTableSchedule;
