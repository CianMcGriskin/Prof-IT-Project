import NavigationBar from '../Navbar/Navbar';
import axios from 'axios';
import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const RegisterReq = () => {
  const [registerRequests, setRegisterRequests] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get('http://localhost:4000/api/registerRequests');
      setRegisterRequests(response.data);
    };
    fetchData();
  }, []);

  const handleApprove = async (id) => {
    const response = await axios.patch(`http://localhost:4000/api/registerRequests/${id}`, {
      status: 'Approved'
    });
    if (response.status === 200) {
      const updatedRequests = registerRequests.map(req => {
        if (req._id === id) {
          return {
            ...req,
            status: 'Approved'
          };
        } else {
          return req;
        }
      });
      setRegisterRequests(updatedRequests);
    }
  };

  return (
    <div>
      <NavigationBar />
      <div>
        <h1>Register Requests</h1>
        <table>
          <thead>
            <tr>
              <th>User ID</th>
              <th>Status</th>
              <th>Hourly Rate</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {registerRequests.map(req => (
              <tr key={req._id}>
                <td>{req.UserID}</td>
                <td>{req.status}</td>
                <td>{req.hourlyRate}</td>
                <td>
                  {req.status === 'Pending' && (
                    <button onClick={() => handleApprove(req._id)}>Approve</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RegisterReq;
