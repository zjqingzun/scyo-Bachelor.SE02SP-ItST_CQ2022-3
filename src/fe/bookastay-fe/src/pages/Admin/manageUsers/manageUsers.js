import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './manageUsers.css';
import icons from "~/assets/icon";

function ManageUsers() {
  const [applications, setApplications] = useState([
    { id: 1, name: 'John Doe', email: 'john.doe@example.com', phone: '123-456-7890', dob: '1990-01-15', cccd: '012345678901' },
    { id: 2, name: 'Emily Smith', email: 'emily.smith@example.com', phone: '987-654-3210', dob: '1992-03-20', cccd: '012345678902' },
    { id: 3, name: 'Michael Johnson', email: 'michael.johnson@example.com', phone: '456-789-1234', dob: '1988-07-11', cccd: '012345678903' },
    { id: 4, name: 'Emma Wilson', email: 'emma.wilson@example.com', phone: '789-123-4567', dob: '1995-10-05', cccd: '012345678904' },
    { id: 5, name: 'Olivia Brown', email: 'olivia.brown@example.com', phone: '321-654-9870', dob: '1991-12-22', cccd: '012345678905' },
    { id: 6, name: 'Sophia Davis', email: 'sophia.davis@example.com', phone: '654-321-0987', dob: '1993-05-18', cccd: '012345678906' },
    { id: 7, name: 'Liam Martinez', email: 'liam.martinez@example.com', phone: '890-123-4567', dob: '1989-08-09', cccd: '012345678907' },
    { id: 8, name: 'Isabella Garcia', email: 'isabella.garcia@example.com', phone: '123-890-4567', dob: '1996-02-14', cccd: '012345678908' },
    { id: 9, name: 'Mason Martinez', email: 'mason.martinez@example.com', phone: '567-123-8904', dob: '1990-11-03', cccd: '012345678909' },
    { id: 10, name: 'Lucas Clark', email: 'lucas.clark@example.com', phone: '890-456-1237', dob: '1987-09-25', cccd: '012345678910' },
    { id: 11, name: 'Charlotte Rodriguez', email: 'charlotte.rodriguez@example.com', phone: '345-678-9012', dob: '1994-04-07', cccd: '012345678911' },
    { id: 12, name: 'Aiden Lopez', email: 'aiden.lopez@example.com', phone: '789-012-3456', dob: '1992-06-12', cccd: '012345678912' },
    { id: 13, name: 'Amelia Hernandez', email: 'amelia.hernandez@example.com', phone: '456-789-0123', dob: '1993-03-30', cccd: '012345678913' },
    { id: 14, name: 'Benjamin Hill', email: 'benjamin.hill@example.com', phone: '678-901-2345', dob: '1985-07-19', cccd: '012345678914' },
    { id: 15, name: 'Mia Lee', email: 'mia.lee@example.com', phone: '234-567-8901', dob: '1998-01-10', cccd: '012345678915' },


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
    <div className="d-flex flex-column px-5 py-3 m-5 users">
      <div className="title mb-4">Users</div>
      <table className="table table-hover">
        <thead className='table-dark fs-3'>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Date of birth</th>
            <th>Identify</th>
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
              <td>{app.name}</td>
              <td>{app.email}</td>
              <td>{app.phone}</td>
              <td>{app.dob}</td>
              <td>{app.cccd}</td>
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
          <img src={icons.chevronLeftPinkIcon} class="left-icon icon m-2"/>
        </button>
        <span className="fs-2">
          {currentPage} / {totalPages}
        </span>
        <button
          className="btn" style={{ backgroundColor: '#1C2D6E' }}
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          <img src={icons.chevronRightPinkIcon} class="right-icon icon m-2"/>
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

export default ManageUsers;
