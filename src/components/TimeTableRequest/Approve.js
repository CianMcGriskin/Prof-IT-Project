import React from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';

const AdminApproval = () => {
  const location = useLocation();
  const modifiedTimetable = location.state?.modifiedTimetable;

  const handleApproval = async (isApproved) => {
    if (isApproved) {
      try {
        await axios.put(`http://localhost:4000/timetables/${modifiedTimetable._id}`, modifiedTimetable);
        alert('Timetable update approved and saved.');
      } catch (error) {
        console.error('Error updating timetable', error);
      }
    } else {
      alert('Timetable update denied.');
    }
  };

  return (
    <>
      {modifiedTimetable && (
        <>
          <h1>Modified Timetable</h1>
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
              {modifiedTimetable.schedule.map((day, index) => (
                <tr key={index}>
                  <td>{day[0]}</td>
                  <td>{day[1].slice(11, 16)}</td>
                  <td>{day[2].slice(11, 16)}</td>
                  <td>{day[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
      <button onClick={() => handleApproval(true)}>Approve</button>
      <button onClick={() => handleApproval(false)}>Deny</button>
    </>
  );
};

export default AdminApproval;
