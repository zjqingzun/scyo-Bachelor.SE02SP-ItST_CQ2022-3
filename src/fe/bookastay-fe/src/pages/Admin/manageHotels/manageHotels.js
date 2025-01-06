import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './manageHotels.css';
import icons from "~/assets/icon";

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

  const [showModal, setShowModal] = useState(false);

  const handleDeleteClick = () => {
    setShowModal(true); // Hiện modal
  };

  const handleConfirmDelete = () => {
    // Xử lý logic xóa tại đây
    console.log('Item deleted!');
    setShowModal(false); // Ẩn modal
  };

  const handleCancelDelete = () => {
    setShowModal(false); // Đóng modal
  };

  return (
    <div className="d-flex flex-column px-5 py-3 m-5 hotels">
      <h1 className="title mb-4">Hotels List</h1>
      <table className="table table-hover">
        <thead className='table-dark fs-3'>
          <tr>
            <th>ID</th>
            <th>Hotel name</th>
            <th>Owner name</th>
            <th>Location</th>
            <th></th>
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
                <a style={{ cursor: 'pointer' }} onClick={handleDeleteClick}>
                  <img src={icons.trashIcon} alt='Delete' class='icon trash-icon' />
                </a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div style={styles.modal}>
          <div style={styles.modalContent}>
            <p className='fs-3 mb-4 fw-semibold'>Are you sure to delete it?</p>
            <button onClick={handleConfirmDelete} className='btn btn-danger me-3 mb-2 px-3 fs-3'>
              Yes
            </button>
            <button onClick={handleCancelDelete} className='btn btn-primary mb-2 px-3 fs-3'>
              No
            </button>
          </div>
        </div>
      )}

      <div className="d-flex justify-content-evenly align-items-center mt-5">
        <button
          className="btn" style={{ backgroundColor: '#1C2D6E' }}
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          <img src={icons.chevronLeftPinkIcon} class="left-icon icon m-2" />
        </button>
        <span className="fs-2">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn" style={{ backgroundColor: '#1C2D6E' }}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <img src={icons.chevronRightPinkIcon} class="right-icon icon m-2" />
        </button>
      </div>
    </div>
  );
}

const styles = {
  modal: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '25px 35px',
    borderRadius: '8px',
    textAlign: 'center',
  },
};

export default ManageHotels;
