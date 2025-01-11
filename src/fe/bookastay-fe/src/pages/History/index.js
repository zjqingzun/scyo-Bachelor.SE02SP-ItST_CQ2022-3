import React, { useEffect, useState } from "react";
import "./history.css";
import icons from "~/assets/icon";
import HistoryCard from "~/components/HotelCard/HistoryCard";
import { getBookingHistory } from "~/services/apiService";
import { useSelector } from "react-redux";
import { Pagination } from "antd";
import { useTranslation } from "react-i18next";

const History = () => {
    const { t } = useTranslation();

    const userInfo = useSelector((state) => state.account.userInfo);

    const [bookingHistory, setBookingHistory] = useState([]);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalItems, setTotalItems] = useState(0);
    const [pageSizes, setPageSizes] = useState(6);
    const [pendingBooking, setPendingBooking] = useState(null);

    const [selectedCard, setSelectedCard] = useState(null);

    // Change page

    const handleCardClick = (card) => {};

    const closeModal = () => {
        setSelectedCard(null);
    };

    const fetchHistory = async () => {
        try {
            const res = await getBookingHistory({
                userId: userInfo.id,
                page: currentPage,
                per_page: pageSizes,
            });

            if (res && +res.statusCode === 200) {
                let bookings = res.data.bookings;

                bookings = bookings.map((booking) => {
                    let date = new Date(booking.created);
                    let day = date.getDate();
                    let time = date.toLocaleTimeString();

                    return {
                        ...booking,
                        date: `${day < 10 ? "0" + day : day}/${(date.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")}/${date.getFullYear()}`,
                        time: time,
                    };
                });

                setBookingHistory(bookings);
                setTotalItems(res.data.total);

                if (res.data.tempBooking) {
                    setPendingBooking(res.data.tempBooking);
                }
            }

            console.log(">>> History data", res);
        } catch (error) {}
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    useEffect(() => {
        fetchHistory();
    }, [currentPage, pageSizes]);

    const handlePaginationChange = (page, pageSize) => {
        setCurrentPage(page);
        setPageSizes(pageSize);
    };

    return (
        <div>
            <div className="row my-5">
                <div className="col-6 d-flex align-items-center ps-5 pt-5">
                    <img
                        src={icons.clockRotateLeftIcon}
                        alt="ClockRotateLeft"
                        className="clockRotateLeftIcon ms-5"
                    />
                    <h1 className="ms-5 pt-2">{t("history.history")}</h1>
                </div>
            </div>

            {/* Hiển thị thông báo nếu có booking đang chờ xác nhận */}
            {pendingBooking && (
                <div>
                    <HistoryCard
                        key={pendingBooking.hotelId}
                        status={pendingBooking.status}
                        id={pendingBooking.hotelId}
                        hotelName={pendingBooking.hotelName}
                        money={pendingBooking.totalCost}
                        onClick={() => handleCardClick(pendingBooking)} // Set trực tiếp
                    />
                </div>
            )}

            <div className="row">
                {bookingHistory.map((card, index) => (
                    <HistoryCard
                        key={card.id}
                        date={card.date}
                        time={card.time}
                        status={card.status}
                        id={card.id}
                        hotelName={card.name}
                        money={card.totalcost}
                    />
                ))}
            </div>

            {/* Modal để hiển thị thông tin chi tiết */}
            {selectedCard && (
                <div className="modal">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title fs-1">Booking Details</h5>
                        </div>
                        <div className="modal-body my-3">
                            <div className="card">
                                <div className="row">
                                    <div className="col-4">
                                        <img
                                            src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=1770&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                                            className="img-fluid rounded-start"
                                            alt="..."
                                        />
                                    </div>
                                    <div className="col-8 py-3">
                                        <div className="card-body">
                                            <h3 className="card-title">{selectedCard.hotelName}</h3>
                                            <p className="card-text">
                                                <small className="text-body-secondary">
                                                    {selectedCard.address}
                                                </small>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-4">
                                <div className="col-6">
                                    <div className="card">
                                        <div className="card-body mx-4 mt-1">
                                            <h3 className="card-title">Check-in</h3>
                                            <h4 className="card-subtitle mb-2 text-body-secondary">
                                                02/12/2024
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-6">
                                    <div className="card">
                                        <div className="card-body mx-4 mt-1">
                                            <h3 className="card-title">Check-out</h3>
                                            <h4 className="card-subtitle mb-2 text-body-secondary">
                                                03/12/2024
                                            </h4>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="row mt-5">
                                <div className="col-7">
                                    <p className="fs-4">
                                        <strong>ID: </strong>1365
                                    </p>
                                    <p className="fs-4">
                                        <strong>Phone number:</strong> +84944130035
                                    </p>
                                    <p className="fs-4">
                                        <strong>Name:</strong> Nguyen Van A
                                    </p>
                                </div>
                                <div className="col-5">
                                    <p className="fs-4">
                                        <strong>Status:</strong> {selectedCard.status}
                                    </p>
                                    <p className="fs-4">
                                        <strong>Money:</strong> {selectedCard.money}
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="modal-footer">
                            <button
                                className="btn btn-danger fs-3 py-2 px-4 mt-2"
                                onClick={closeModal}
                            >
                                Close
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Pagination */}
            {bookingHistory.length > 0 && (
                <div className="pagination mt-5 d-flex justify-content-center">
                    <Pagination
                        showQuickJumper
                        defaultCurrent={currentPage}
                        total={totalItems}
                        defaultPageSize={pageSizes}
                        pageSizeOptions={[6, 12, 18, 24]}
                        onChange={(page, pageSize) => {
                            handlePaginationChange(page, pageSize);
                        }}
                    />
                </div>
            )}
        </div>
    );
};

export default History;
