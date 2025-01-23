import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';

function RequestDetails() {
  const { id } = useParams(); // Lấy ID từ URL
  const navigate = useNavigate();

  // Dữ liệu tạm thời, có thể thay bằng API call
  const application = {
    id,
    mail: 'owner@example.com',
    name: `Hotel ${id}`,
    location: 'City Example',
    time: '18:15 25/12/2024',
    roomNumber: 5,
    images: [
      'https://kinsley.bslthemes.com/wp-content/uploads/2021/08/img-banner-2-scaled-1-1920x1315.jpg',
      'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://images.unsplash.com/photo-1540541338287-41700207dee6?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      'https://plus.unsplash.com/premium_photo-1663050967225-1735152ab894?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
    ]
  };

  const handleApprove = () => {
    alert(`Approved application for ${application.name}`);
    navigate('/manage-requests');
  };

  const handleReject = () => {
    alert(`Rejected application for ${application.name}`);
    navigate('/manage-requests');
  };

  return (
    <div className='row mx-5 my-4'>
      <h1 className='mb-4'>Request Details</h1>
      <div className="col-6">
        <p><strong>ID:</strong> {application.id}</p>
        <p><strong>Mail:</strong> {application.mail}</p>
        <p><strong>Name:</strong> {application.name}</p>
        <p><strong>Location:</strong> {application.location}</p>
        <p><strong>Time:</strong> {application.time}</p>
        <p><strong>Room Number:</strong> {application.roomNumber}</p>

        <button className="btn btn-success me-2 px-3 mt-3" onClick={handleApprove}>
          Approve
        </button>
        <button className="btn btn-danger px-3 mt-3" onClick={handleReject}>
          Reject
        </button>
      </div>
      <div className='col-6'>
        {application.images.map((image, index) => (
          <img key={index} src={image} alt={`Image ${index}`} className='img-fluid m-2' style={{ width: '220px', borderRadius: '5px'}} />
        ))}
      </div>
    </div>
  );
}

export default RequestDetails;
