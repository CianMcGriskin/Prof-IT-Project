import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminApproval = () => {
  const [requests, setRequests] = useState([]); // array of timetable change requests
  const [timetables, setTimetables] = useState([]); // array of existing timetables

  useEffect(() => {

    const fetchRequests = async () => {
      try {
        const response = await axios.get("http://localhost:4000/modify-hours"); 
        setRequests(response.data);

        // Retrieve existing timetables
        const timetablesResponse = await axios.get(
          "http://localhost:4000/timetables"
        ); 
        setTimetables(timetablesResponse.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };

    fetchRequests();
  }, []);

  const highlightDifferences = (timetable1, timetable2) => {
    const highlightedDays = {};

    // Loop through each day in the modified timetable
    timetable2.schedule.forEach((day2) => {
      // Find the corresponding day in the existing timetable
      const existingDay = timetable1.schedule.find((d) => d[0] === day2[0]);

      // If the day doesnt exist in the existing timetable or the times are different
      if (
        !existingDay ||
        existingDay[1] !== day2[1] ||
        existingDay[2] !== day2[2]
      ) {
        // Highlight the day
        highlightedDays[day2[0]] = true;
      }
    });

    return highlightedDays;
  };

  const handleApproval = async (isApproved, index) => {
    const { userInfo, ...modifiedTimetable } = requests[index]; // get the modified timetable data

    //Format timetable
    const updatedTimetable = {
      schedule: modifiedTimetable.schedule.map((day) => [
        day[0],
        day[1],
        day[2],
        day[3],
      ]),
      userID: modifiedTimetable.userID,
      weekID: modifiedTimetable.weekID,
    };

    try {
      if (isApproved) {
        // Find existing timetable with the same userID and weekID
        const existingTimetableIndex = timetables.findIndex(
          (t) =>
            t.userID === modifiedTimetable.userID &&
            t.weekID === modifiedTimetable.weekID
        );
        if (existingTimetableIndex !== -1) {
          // If an existing timetable exists, update it with the modified timetable
          const existingTimetable = timetables[existingTimetableIndex];
          const updatedDays = updatedTimetable.schedule.map((day2) => {
            const existingDay = existingTimetable.schedule.find(
              (d) => d[0] === day2[0]
            );
            if (existingDay) {
              return existingDay[3] !== day2[3] ? day2 : existingDay;
            }
            return day2;
          });
          const updatedTimetableData = {
            ...existingTimetable,
            schedule: updatedDays,
          };
          await axios.put(
            `http://localhost:4000/timetables/${existingTimetable._id}`,
            updatedTimetableData
          ); // update existing timetable
          console.log(existingTimetable._id);
        } else {
          // If no existing timetable exists, create a new one with the modified timetable
          await axios.post(
            `http://localhost:4000/timetables`,
            updatedTimetable
          ); // create new timetable
        }
        alert("Timetable update approved and saved.");
        console.log(updatedTimetable);
      } else {
        alert("Timetable update denied.");
      }
      // Delete the timetable change request from the database
      await axios.delete(
        `http://localhost:4000/modify-hours/${modifiedTimetable._id}`
      );
      setRequests(requests.filter((_, i) => i !== index)); // remove the request from the requests array
    } catch (error) {
      console.error("Error handling approval", error);
    }
  };
  return (
    <>
      <h1>Requested Timetable change</h1>
      {requests.map((modifiedTimetable, index) => {
        // Find the corresponding existing timetable for the request based on weekid and userid
        const existingTimetable = timetables.find(
          t => t.userID === modifiedTimetable.userID && t.weekID === modifiedTimetable.weekID
        );
        // Highlight the differences between the modified timetable and the existing timetable
        const highlightedDays = highlightDifferences(
          existingTimetable || { schedule: [] },
          modifiedTimetable
        );
  
        return (
          <div key={index}>
            {modifiedTimetable.userInfo && (
              <h3>
                Requester: {modifiedTimetable.userInfo.firstName} {modifiedTimetable.userInfo.lastName} Id:{modifiedTimetable.userInfo.userID} 
              </h3>
            )}
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
                {/* Map over index of array*/}
                {modifiedTimetable.schedule.map((day, i) => (
                  <tr
                    key={i}
                    style={{
                      backgroundColor: highlightedDays[day[0]] ? "yellow" : "white"
                    }}
                  >
                    {/* Display start,end time extract minutes*/}
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
        );
      })}
    </>
  );
  
};

export default AdminApproval;
