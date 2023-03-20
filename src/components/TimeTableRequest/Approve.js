import React, { useState, useEffect } from "react";

import axios from "axios";


const AdminApproval = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/modify-hours");
        setRequests(response.data);
      } catch (error) {
        console.error("Error fetching modification requests", error);
      }
    };

    fetchRequests();
  }, []);

  const handleApproval = async (isApproved, index) => {
    const modifiedTimetable = requests[index];
  
    try {
      if (isApproved) {
        await axios.put(`http://localhost:4000/timetables/${modifiedTimetable._id}`, modifiedTimetable);
        alert("Timetable update approved and saved.");
      } else {
        alert("Timetable update denied.");
      }
  
      // Delete the request from the ModifyHours collection
      await axios.delete(`http://localhost:4000/modify-hours/${modifiedTimetable._id}`);
      setRequests(requests.filter((_, i) => i !== index));
    } catch (error) {
      console.error("Error handling approval", error);
    }
  };
  

  return (
    <>
      {requests.map((modifiedTimetable, index) => (
        <div key={index}>
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
              {modifiedTimetable.schedule.map((day, i) => (
                <tr key={i}>
                  <td>{day[0]}</td>
                  <td>{day[1].slice(11, 16)}</td>
                  <td>{day[2].slice(11, 16)}</td>
                  <td>{day[3]}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => handleApproval(true, index)}>Approve</button>
          <button onClick={() => handleApproval(false, index)}>Deny</button>
        </div>
      ))}
    </>
  );
};

export default AdminApproval;
