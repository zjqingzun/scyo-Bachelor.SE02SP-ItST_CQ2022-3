import React, { useState } from 'react';
import './history.css';
import icons from "~/assets/icon";
import HistoryCard from "~/components/HotelCard/HistoryCard";

const History = () => {
    // Mock data (giả sử bạn sẽ fetch từ API hoặc database)
    const cardsData = [
        { date: '30/12/2024', time: '10:00 AM', status: 'Booked', id: '#1234', hotelName: 'Hotel ABC', money: '$200', address: '123 ABC Street, XYZ City' },
        { date: '29/12/2024', time: '11:00 AM', status: 'Cancelled', id: '#1235', hotelName: 'Hotel XYZ', money: '$150', address: '456 XYZ Street, ABC City' },
        { date: '27/12/2024', time: '12:00 PM', status: 'Checked Out', id: '#1236', hotelName: 'Hotel LMN', money: '$300', address: '789 LMN Street, DEF City' },
        { date: '25/12/2024', time: '01:00 PM', status: 'Booked', id: '#1237', hotelName: 'Hotel DEF', money: '$250', address: '012 DEF Street, GHI City' },
        { date: '20/12/2024', time: '02:00 PM', status: 'Cancelled', id: '#1238', hotelName: 'Hotel GHI', money: '$180', address: '345 GHI Street, JKL City' },
        { date: '11/12/2024', time: '03:00 PM', status: 'Booked', id: '#1239', hotelName: 'Hotel PQR', money: '$400', address: '678 PQR Street, STU City' },
        { date: '01/12/2024', time: '04:00 PM', status: 'Checked Out', id: '#1240', hotelName: 'Hotel STU', money: '$350', address: '901 STU Street, VWX City' },
        { date: '01/11/2024', time: '05:00 PM', status: 'Booked', id: '#1241', hotelName: 'Hotel VWX', money: '$500', address: '234 VWX Street, YZA City' },
        { date: '02/11/2024', time: '06:00 PM', status: 'Cancelled', id: '#1242', hotelName: 'Hotel YZA', money: '$450', address: '567 YZA Street, BCD City' },
        { date: '03/10/2024', time: '07:00 PM', status: 'Booked', id: '#1243', hotelName: 'Hotel BCD', money: '$600', address: '890 BCD Street, EFG City' },
        { date: '04/09/2024', time: '08:00 PM', status: 'Checked Out', id: '#1244', hotelName: 'Hotel EFG', money: '$550', address: '123 EFG Street, HIJ City' },
        { date: '05/08/2024', time: '09:00 PM', status: 'Booked', id: '#1245', hotelName: 'Hotel HIJ', money: '$700', address: '456 HIJ Street, KLM City' },
        { date: '03/08/2024', time: '10:00 PM', status: 'Cancelled', id: '#1246', hotelName: 'Hotel KLM', money: '$650', address: '789 KLM Street, NOP City' },
        { date: '01/07/2024', time: '11:00 PM', status: 'Booked', id: '#1247', hotelName: 'Hotel NOP', money: '$800', address: '012 NOP Street, QRS City' },
        { date: '08/06/2024', time: '12:00 AM', status: 'Checked Out', id: '#1248', hotelName: 'Hotel QRS', money: '$750', address: '345 QRS Street, TUV City' },
    ];

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 8; // 8 items per page

    const [selectedCard, setSelectedCard] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const filteredCards = cardsData.filter(card =>
        card.hotelName.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const currentCards = filteredCards.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredCards.length / itemsPerPage);

    // Change page
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleCardClick = (card) => {
        setSelectedCard(card);
    };

    const closeModal = () => {
        setSelectedCard(null);
    };

    return (
        <div>
            <div className='row my-5'>
                <div className='col-6 d-flex align-items-center ps-5 pt-5'>
                    <img src={icons.clockRotateLeftIcon} alt="ClockRotateLeft" className='clockRotateLeftIcon ms-5' />
                    <h1 className='ms-5 pt-2'>History</h1>
                </div>
                <div className='col-6'>
                    <div className="input-group pe-5 pt-5">
                        <input
                            type="text"
                            className="form-control p-3 fs-3"
                            placeholder="Search"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <img src={icons.searchIcon} alt="search" className='btn btn-outline-primary searchIcon' />
                    </div>
                </div>
            </div>

            <div className="row">
                {currentCards.map((card, index) => (
                    <HistoryCard
                        key={index}
                        date={card.date}
                        time={card.time}
                        status={card.status}
                        id={card.id}
                        hotelName={card.hotelName}
                        money={card.money}
                        onClick={() => handleCardClick(card)} // Set trực tiếp
                    />
                ))}
            </div>

            {/* Modal để hiển thị thông tin chi tiết */}
            {selectedCard && (
                <div className="modal" >
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-1">Booking Details</h5>
                        </div>
                        <div className="modal-body my-3">
                            <div className='card'>
                                <div className='row'>
                                    <div className="col-4">
                                        <img src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" className="img-fluid rounded-start" alt="..." />
                                    </div>
                                    <div className="col-8 py-3">
                                        <div className="card-body">
                                            <h3 className="card-title">{selectedCard.hotelName}</h3>
                                            <p className="card-text"><small className="text-body-secondary">{selectedCard.address}</small></p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <div className="card">
                                        <div className="card-body mx-4 mt-1">
                                            <h3 className="card-title">Check-in</h3>
                                            <h4 className="card-subtitle mb-2 text-body-secondary">02/12/2024</h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card">
                                        <div className="card-body mx-4 mt-1">
                                            <h3 className="card-title">Check-out</h3>
                                            <h4 className="card-subtitle mb-2 text-body-secondary">03/12/2024</h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-7">
                                    <p className="fs-4"><strong>ID: </strong>1365</p>
                                    <p className="fs-4"><strong>Phone number:</strong> +84944130035</p>
                                    <p className="fs-4"><strong>Name:</strong> Nguyen Van A</p>
                                </div>
                                <div className="col-5">
                                    <p className="fs-4"><strong>Status:</strong> {selectedCard.status}</p>
                                    <p className="fs-4"><strong>Money:</strong> {selectedCard.money}</p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button className="btn btn-danger fs-3 py-2 px-4 mt-2" onClick={closeModal}>Close</button>
                        </div>
                    </div>
                </div>
            )}


            {/* Pagination */}
            <div className="d-flex justify-content-center my-5 pb-5 pt-3">
                <nav>
                    <ul className="pagination">
                        {/* Nút "Trước" */}
                        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                            <button
                                className="page-link px-4 py-2 fs-2"
                                onClick={() => handlePageChange(currentPage - 1)}
                                aria-label="Previous"
                                disabled={currentPage === 1}
                            >
                                <span aria-hidden="true">&laquo;</span>
                            </button>
                        </li>

                        {/* Các số trang */}
                        {[...Array(totalPages).keys()].map((page) => (
                            <li
                                key={page}
                                className={`page-item ${page + 1 === currentPage ? 'active' : ''}`}
                                onClick={() => handlePageChange(page + 1)}
                            >
                                <button className="page-link px-4 py-2 fs-2">{page + 1}</button>
                            </li>
                        ))}

                        {/* Nút "Sau" */}
                        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                            <button
                                className="page-link px-4 py-2 fs-2"
                                onClick={() => handlePageChange(currentPage + 1)}
                                aria-label="Next"
                                disabled={currentPage === totalPages}
                            >
                                <span aria-hidden="true">&raquo;</span>
                            </button>
                        </li>
                    </ul>
                </nav>
            </div>

        </div>

    );
}

export default History;
