import React from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

function HistoryCard({ date, time, status, id, hotelName, money, onClick }) {
    const { t } = useTranslation();

    const navigate = useNavigate();

    return (
        <div className="col-6 px-5 py-3" onClick={onClick}>
            <div className="history-card px-5 pb-4 pt-5 my-4 shadow rounded h-100">
                <div className="row">
                    <div className="col-3 d-flex flex-column align-items-center">
                        <p>{date}</p>
                        <p>{time}</p>
                    </div>
                    <div className="col-6 mx-4">
                        {/* Hiển thị trạng thái với màu xanh nếu là "Booked" */}
                        <h2
                            style={{
                                color:
                                    status === "confirmed"
                                        ? "green"
                                        : "black" && status === "cancelled"
                                        ? "red"
                                        : "black" && status === "completed"
                                        ? "blue"
                                        : "black" && status === "Pending"
                                        ? "orange"
                                        : "black",
                            }}
                        >
                            {status.toUpperCase()}
                        </h2>
                        <p>{id}</p>
                        <p>{hotelName}</p>
                        <p>{money}</p>
                    </div>
                    <div className="col-1">
                        {/* Thêm nút "Review" nếu trạng thái là "Booked" */}
                        {status === "completed" && (
                            <button
                                className="btn btn-primary px-3 fs-4"
                                onClick={(e) => {
                                    e.stopPropagation(); // Ngăn onClick của card kích hoạt
                                    // window.location.href = `/review/${id}`; // Điều hướng đến trang Review
                                    navigate(`/review`, {
                                        state: {
                                            hotelId: id,
                                        },
                                    }); // Điều hướng đến trang Review
                                }}
                            >
                                Review
                            </button>
                        )}

                        {status === "Pending" && (
                            <button
                                className="btn btn-primary px-3 fs-4"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    navigate("/reserve", {
                                        state: { hotelId: id, isReturn: true },
                                    });
                                }}
                            >
                                Return
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default HistoryCard;
