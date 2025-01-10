import { useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import './dashboard.css';

function Dashboard() {
  const [applications, setApplications] = useState([
    { id: 1, mail: 'owner1@example.com', name: 'Hotel ABC', location: 'City A', time: '18:15 31/12/2024', read: false },
    { id: 2, mail: 'owner2@example.com', name: 'Hotel BCM', location: 'City B', time: '10:30 30/12/2024', read: false },
    { id: 3, mail: 'owner3@example.com', name: 'Hotel CAQ', location: 'City C', time: '14:00 29/12/2024', read: false },
    { id: 4, mail: 'owner4@example.com', name: 'Hotel ABB', location: 'City A', time: '08:15 29/12/2024', read: true },
    { id: 5, mail: 'owner5@example.com', name: 'Hotel BMM', location: 'City B', time: '10:30 28/12/2024', read: false },
    { id: 6, mail: 'owner6@example.com', name: 'Hotel XYS', location: 'City C', time: '14:00 27/12/2024', read: true },
    { id: 7, mail: 'owner7@example.com', name: 'Hotel XYS', location: 'City C', time: '14:00 27/12/2024', read: true },
  ]);
  const [totals, setTotals] = useState({
    hotels: 0,
    users: 0,
    hoteliers: 0,
    requests: 0,
  });

  const navigate = useNavigate();

  const handleRowClick = (app) => {
    navigate(`/admin/request/${app.id}`);
  };

  useEffect(() => {
    fetchTotals();
  }, []);

  const fetchTotals = async () => {
    try {
      const hotelsResponse = await fetch('http://localhost:3001/api/hotels/getAll');
      const hotelsData = await hotelsResponse.json();
      console.log(hotelsData);

      const usersResponse = await fetch('http://localhost:3001/api/user/getAll/user');
      const usersData = await usersResponse.json();

      const requestsResponse = await fetch('http://localhost:3001/api/hotels/admin/dashboard/t/request');
      const requestsData = await requestsResponse.json();

      setTotals({
        hotels: hotelsData.total || 0,
        users: usersData.total || 0,
        requests: requestsData.total || 0,
      });
    } catch (error) {
      console.error('Error fetching totals:', error);
    }
  };


  return (
    <div className='dashboard d-flex flex-column px-5 py-3 m-5'>
      <div className="title mb-4">Dashboard</div>
      <div className="d-flex justify-content-between mb-5">
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Hotels</h3>
          <h1>{ totals.hotels }</h1>
        </div>
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Users</h3>
          <h1>{ totals.users }</h1>
        </div>
        <div className="text-white p-4 rounded text-center box" style={{ width: '20%' }}>
          <h3>Total Requests</h3>
          <h1>{ totals.requests }</h1>
        </div>
      </div>
      <div className="applications">
        <h3>New Requests</h3>
        <table className='table table-hover'>
          <thead className='table-dark fs-3'>
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
        <button className="px-4 mt-4" onClick={() => navigate('/admin/manage-requests')}>See more</button>
      </div>
    </div>
  );
}

export default Dashboard;
