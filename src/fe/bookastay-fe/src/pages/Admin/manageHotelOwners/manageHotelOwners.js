import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageHotelOwners() {
  const [applications, setApplications] = useState([
    { id: 1, name: 'Ethan Turner', email: 'ethan.turner@example.com', phone: '456-321-7890', dob: '1991-05-06', cccd: '012345678916' },
    { id: 2, name: 'Ava Collins', email: 'ava.collins@example.com', phone: '789-654-3210', dob: '1990-08-12', cccd: '012345678917' },
    { id: 3, name: 'Noah Perez', email: 'noah.perez@example.com', phone: '890-123-6547', dob: '1993-10-20', cccd: '012345678918' },
    { id: 4, name: 'Harper Evans', email: 'harper.evans@example.com', phone: '321-987-6543', dob: '1992-04-25', cccd: '012345678919' },
    { id: 5, name: 'James Walker', email: 'james.walker@example.com', phone: '123-456-7899', dob: '1989-09-14', cccd: '012345678920' },
    { id: 6, name: 'Ella White', email: 'ella.white@example.com', phone: '654-321-9876', dob: '1996-03-08', cccd: '012345678921' },
    { id: 7, name: 'Henry Lewis', email: 'henry.lewis@example.com', phone: '456-789-1230', dob: '1988-12-02', cccd: '012345678922' },
    { id: 8, name: 'Scarlett Young', email: 'scarlett.young@example.com', phone: '789-123-6541', dob: '1997-06-11', cccd: '012345678923' },
    { id: 9, name: 'Daniel Hall', email: 'daniel.hall@example.com', phone: '890-456-7892', dob: '1986-07-18', cccd: '012345678924' },
    { id: 10, name: 'Aria Scott', email: 'aria.scott@example.com', phone: '987-123-4567', dob: '1994-02-22', cccd: '012345678925' },
    { id: 11, name: 'Oliver Adams', email: 'oliver.adams@example.com', phone: '234-567-8900', dob: '1991-01-09', cccd: '012345678926' },
    { id: 12, name: 'Chloe Carter', email: 'chloe.carter@example.com', phone: '890-567-2345', dob: '1993-11-27', cccd: '012345678927' },
    { id: 13, name: 'Jack King', email: 'jack.king@example.com', phone: '567-234-6789', dob: '1987-08-16', cccd: '012345678928' },
    { id: 14, name: 'Lily Wright', email: 'lily.wright@example.com', phone: '789-890-1234', dob: '1995-09-04', cccd: '012345678929' },
    { id: 15, name: 'Samuel Green', email: 'samuel.green@example.com', phone: '345-678-9012', dob: '1990-02-01', cccd: '012345678930' },
    
  ]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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
      <h1 className="mt-4 mb-5">Owners List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of birth</th>
            <th>Identitfy</th>
          </tr>
        </thead>
        <tbody>
          {displayedApplications.map((app) => (

            <tr
              key={app.id}
              style={{
                cursor: 'pointer',
              }}
            >
              <td>{app.id}</td>
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.dob}</td>
              <td>{app.cccd}</td>
              <td>
                <a style={{ cursor: 'pointer' }} >
                  🗑️
                </a>
              </td>
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

export default ManageHotelOwners;
