import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageRequests() {
  const [applications, setApplications] = useState([
    { id: 1, mail: 'owner1@example.com', name: 'Hotel ABC', location: 'City A', time: '18:15 31/12/2024', read: false },
    { id: 2, mail: 'owner2@example.com', name: 'Hotel BCM', location: 'City B', time: '10:30 30/12/2024', read: false },
    { id: 3, mail: 'owner3@example.com', name: 'Hotel CAQ', location: 'City C', time: '14:00 29/12/2024', read: false },
    { id: 4, mail: 'owner4@example.com', name: 'Hotel ABB', location: 'City A', time: '08:15 29/12/2024', read: true },
    { id: 5, mail: 'owner5@example.com', name: 'Hotel BMM', location: 'City B', time: '10:30 28/12/2024', read: false },
    { id: 6, mail: 'owner6@example.com', name: 'Hotel XYS', location: 'City C', time: '14:00 27/12/2024', read: true },
    { id: 7, mail: 'owner7@example.com', name: 'Hotel DEF', location: 'City D', time: '11:30 26/12/2024', read: false },
    { id: 8, mail: 'owner8@example.com', name: 'Hotel GHI', location: 'City E', time: '15:45 25/12/2024', read: false },
    { id: 9, mail: 'owner9@example.com', name: 'Hotel JKL', location: 'City F', time: '09:15 24/12/2024', read: true },
    { id: 10, mail: 'owner10@example.com', name: 'Hotel MNO', location: 'City G', time: '12:00 23/12/2024', read: false },
    { id: 11, mail: 'owner1@example.com', name: 'Hotel ABC', location: 'City A', time: '18:15 31/12/2024', read: false },
    { id: 12, mail: 'owner2@example.com', name: 'Hotel BCM', location: 'City B', time: '10:30 30/12/2024', read: false },
    { id: 13, mail: 'owner3@example.com', name: 'Hotel CAQ', location: 'City C', time: '14:00 29/12/2024', read: false },
    { id: 14, mail: 'owner4@example.com', name: 'Hotel ABB', location: 'City A', time: '08:15 29/12/2024', read: true },
    { id: 15, mail: 'owner5@example.com', name: 'Hotel BMM', location: 'City B', time: '10:30 28/12/2024', read: false },
    { id: 16, mail: 'owner6@example.com', name: 'Hotel XYS', location: 'City C', time: '14:00 27/12/2024', read: true },
    { id: 17, mail: 'owner7@example.com', name: 'Hotel DEF', location: 'City D', time: '11:30 26/12/2024', read: false },
    { id: 18, mail: 'owner8@example.com', name: 'Hotel GHI', location: 'City E', time: '15:45 25/12/2024', read: false },
    { id: 19, mail: 'owner9@example.com', name: 'Hotel JKL', location: 'City F', time: '09:15 24/12/2024', read: true },
    { id: 20, mail: 'owner10@example.com', name: 'Hotel MNO', location: 'City G', time: '12:00 23/12/2024', read: false },
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const navigate = useNavigate();

  const handleRowClick = (app) => {
    navigate(`/request/details/${app.id}`);
  };

  const totalPages = Math.ceil(applications.length / itemsPerPage);

  const displayedApplications = applications.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  return (
    <div className="mx-5 my-4">
      <h1 className="mt-4 mb-5">Applications</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Mail</th>
            <th>Name</th>
            <th>Location</th>
            <th>Time</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {displayedApplications.map((app) => (
            
            <tr
              key={app.id}
              onClick={() => handleRowClick(app)}
              style={{
                fontWeight: app.read ? 'normal' : 'bold',
                cursor: 'pointer',
              }}
            >
              <td>{app.id}</td>
              <td>{app.mail}</td>
              <td>{app.name}</td>
              <td>{app.location}</td>
              <td>{app.time}</td>
              <td>{app.read ? 'Read' : 'Unread'}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="d-flex justify-content-between align-items-center mt-5">
        <button
          className="btn btn-primary"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          Previous
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="btn btn-primary"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next
        </button>
      </div>
    </div>
  );
}

export default ManageRequests;
