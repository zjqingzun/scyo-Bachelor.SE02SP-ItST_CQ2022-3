import { useNavigate } from 'react-router-dom';
import React, { useState } from 'react';
import './dashboard.css';

function Dashboard() {
  const [applications, setApplications] = useState([
    { id: 1, mail: 'owner1@example.com', name: 'Hotel ABC', location: 'City A', time: '18:15 31/12/2024', read: false },
    { id: 2, mail: 'owner2@example.com', name: 'Hotel BCM', location: 'City B', time: '10:30 30/12/2024', read: false },
    { id: 3, mail: 'owner3@example.com', name: 'Hotel CAQ', location: 'City C', time: '14:00 29/12/2024', read: false },
    { id: 4, mail: 'owner4@example.com', name: 'Hotel ABB', location: 'City A', time: '08:15 29/12/2024', read: true },
    { id: 5, mail: 'owner5@example.com', name: 'Hotel BMM', location: 'City B', time: '10:30 28/12/2024', read: false },
    { id: 6, mail: 'owner6@example.com', name: 'Hotel XYS', location: 'City C', time: '14:00 27/12/2024', read: true },
  ]);

  const navigate = useNavigate();

  const handleRowClick = (app) => {
    navigate(`/request/details/${app.id}`);
  };

  return (
    <div>
      <h1 className="mx-5 my-3">Dashboard</h1>
      <div className="mx-5 d-flex justify-content-between my-4">
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Hotels</h3>
          <h1>100</h1>
        </div>
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Users</h3>
          <h1>2342</h1>
        </div>
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Owners</h3>
          <h1>2342</h1>
        </div>
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Requests</h3>
          <h1>1203</h1>
        </div>
      </div>
      <div className="mx-5 my-4">
        <h3 className='mb-3 mt-5'>New Applications</h3>
        <table className="table">
          <thead>
            <tr>
              <th>Mail</th>
              <th>Name</th>
              <th>Location</th>
              <th>Time</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                onClick={() => handleRowClick(app)}
                style={{ fontWeight: app.read ? 'normal' : 'bold', cursor: 'pointer' }}
              >
                <td>{app.mail}</td>
                <td>{app.name}</td>
                <td>{app.location}</td>
                <td>{app.time}</td>
                <td>{app.read ? 'Read' : 'Unread'}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <button className="px-3 mt-2" onClick={() => navigate('/manage-requests')}>See more</button>
      </div>
    </div>
  );
}

export default Dashboard;
