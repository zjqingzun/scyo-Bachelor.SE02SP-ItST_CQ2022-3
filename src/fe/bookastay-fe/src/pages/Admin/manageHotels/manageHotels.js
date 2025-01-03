import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function ManageHotels() {
  const [applications, setApplications] = useState([
    { id: 1, hotelName: 'Grand Palace', owner: 'John Doe', location: '123 Main Street, Manhattan, New York, NY' },
    { id: 2, hotelName: 'Ocean View', owner: 'Emily Smith', location: '45 Seaside Boulevard, South Beach, Miami, FL' },
    { id: 3, hotelName: 'Mountain Retreat', owner: 'Michael Johnson', location: '78 Alpine Road, Aspen District, Denver, CO' },
    { id: 4, hotelName: 'City Central', owner: 'Emma Wilson', location: '10 Lakeview Avenue, Downtown, Chicago, IL' },
    { id: 5, hotelName: 'Luxury Suites', owner: 'Olivia Brown', location: '50 Sunset Boulevard, Beverly Hills, Los Angeles, CA' },
    { id: 6, hotelName: 'Budget Inn', owner: 'Sophia Davis', location: '15 Greenway Street, West End, Houston, TX' },
    { id: 7, hotelName: 'Sunset Lodge', owner: 'Liam Martinez', location: '25 Ocean Drive, Fisherman Wharf, San Francisco, CA' },
    { id: 8, hotelName: 'Cozy Cabin', owner: 'Isabella Garcia', location: '33 Pinecone Lane, Forest District, Seattle, WA' },
    { id: 9, hotelName: 'Downtown Hotel', owner: 'Mason Martinez', location: '101 Peach Avenue, Midtown, Atlanta, GA' },
    { id: 10, hotelName: 'Seaside Resort', owner: 'Lucas Clark', location: '89 Beachside Road, Pacific Heights, San Diego, CA' },
    { id: 11, hotelName: 'Urban Stay', owner: 'Charlotte Rodriguez', location: '70 Riverside Drive, Cambridge District, Boston, MA' },
    { id: 12, hotelName: 'The Royal', owner: 'Aiden Lopez', location: '120 King Street, Paradise Area, Las Vegas, NV' },
    { id: 13, hotelName: 'Country Inn', owner: 'Amelia Hernandez', location: '67 Farm Lane, Downtown, Nashville, TN' },
    { id: 14, hotelName: 'Skyline View', owner: 'Benjamin Hill', location: '210 Skyline Avenue, Chestnut Hill, Philadelphia, PA' },
    { id: 15, hotelName: 'Harbor Hotel', owner: 'Mia Lee', location: '88 Waterfront Street, Pearl District, Portland, OR' },

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
      <h1 className="mt-4 mb-5">Hotels List</h1>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Hotel name</th>
            <th>Owner name</th>
            <th>Location</th>
            <th>Actions</th>
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
              <td>{app.hotelName}</td>
              <td>{app.owner}</td>
              <td>{app.location}</td>
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

export default ManageHotels;
