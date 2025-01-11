import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./manageHotels.css";
import icons from "~/assets/icon";
import { useSelector } from "react-redux";

import axios from "~/utils/axiosCustomize";

function ManageHotels() {
  const [applications, setApplications] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Số lượng người dùng trên mỗi trang
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selectedHotelId, setSelectedHotelId] = useState(null);
  const [totalHotels, setTotalHotels] = useState(0); // State để lưu tổng số người dùng

    const [inputPage, setInputPage] = useState(""); // Input cho số trang
    const handleInputPageChange = (e) => {
        setInputPage(e.target.value);
    };

    // Hàm fetch data từ API
    const fetchHotels = async (page, limit) => {
        setLoading(true);
        try {
            const response = await axios.get(`/hotels/getAll?page=${page}&limit=${limit}`);

            // Cập nhật state với dữ liệu từ API
            setApplications(response.hotels);
            setTotalPages(response.total_pages);
            setTotalHotels(response.total); // Lấy tổng số người dùng từ API
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    // Gọi fetchUsers khi trang hoặc itemsPerPage thay đổi
    useEffect(() => {
        fetchHotels(currentPage, itemsPerPage);
    }, [currentPage, itemsPerPage]);

    const handlePageChange = (newPage) => {
        if (newPage > 0 && newPage <= totalPages) {
            setCurrentPage(newPage);
        }
    };

    const handleGoToPage = () => {
        const page = parseInt(inputPage, 10);
        if (!isNaN(page) && page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        } else {
            alert(`Please enter a valid page number between 1 and ${totalPages}`);
        }
    };

    const [showModal, setShowModal] = useState(false);

    const handleDeleteClick = (hotelId) => {
        setSelectedHotelId(hotelId);
        setShowModal(true);
    };
    const yourAccessToken = localStorage.getItem("accessToken");

    const handleConfirmDelete = async () => {
        if (selectedHotelId) {
            try {
                const response = await axios.delete(`/hotels/${selectedHotelId}`);

                if (response && +response.status === 200) {
                    alert("Hotel deleted successfully!");
                    // Cập nhật danh sách người dùng
                    fetchHotels(currentPage, itemsPerPage);
                } else {
                    alert(`Error deleting hotel: ${response.message}`);
                }
            } catch (error) {
                console.error("Error deleting hotel:", error);
                alert("An error occurred while deleting the hotel.");
            } finally {
                setShowModal(false); // Đóng modal
            }
        }
        setShowModal(false);
    };

    const handleCancelDelete = () => {
        setShowModal(false);
    };

    return (
        <div className="d-flex flex-column px-5 py-3 m-5 hotels">
            <div className="d-flex justify-content-between mb-4">
                <div className="title">Hotels</div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Hotels</h3>
                    <h1>{totalHotels}</h1>
                </div>
            </div>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table className="table table-hover">
                        <thead className="table-dark fs-3">
                            <tr>
                                <th>ID</th>
                                <th>Name</th>
                                <th>Owner</th>
                                <th>Location</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.map((app) => (
                                <tr
                                    key={app.id}
                                    style={{
                                        cursor: "pointer",
                                    }}
                                >
                                    <td>{app.id}</td>
                                    <td>{app.name}</td>
                                    <td>{app.hotelierName}</td>
                                    <td>{app.location}</td>
                                    <td>
                                        <a
                                            style={{ cursor: "pointer" }}
                                            onClick={() => handleDeleteClick(app.id)}
                                        >
                                            <img
                                                src={icons.trashIcon}
                                                alt="Delete"
                                                className="icon trash-icon"
                                            />
                                        </a>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {showModal && (
                        <div style={styles.modal}>
                            <div style={styles.modalContent}>
                                <p className="fs-3 mb-4 fw-semibold">Are you sure to delete it?</p>
                                <button
                                    onClick={handleConfirmDelete}
                                    className="btn btn-danger me-3 mb-2 px-3 fs-3"
                                >
                                    Yes
                                </button>
                                <button
                                    onClick={handleCancelDelete}
                                    className="btn btn-primary mb-2 px-3 fs-3"
                                >
                                    No
                                </button>
                            </div>
                        </div>
                    )}

                    <div className="d-flex justify-content-evenly align-items-center mt-5">
                        <button
                            className="btn"
                            style={{ backgroundColor: "#1C2D6E" }}
                            disabled={currentPage === 1}
                            onClick={() => handlePageChange(currentPage - 1)}
                        >
                            <img src={icons.chevronLeftPinkIcon} className="left-icon icon m-2" />
                        </button>
                        <span className="fs-2">
                            {currentPage} / {totalPages}
                        </span>
                        <div className="d-flex justify-content-center align-items-center">
                            <input
                                type="number"
                                value={inputPage}
                                onChange={handleInputPageChange}
                                className="form-control mx-2 fs-4"
                                placeholder="Page"
                                style={{ width: "100px", padding: "5px 15px" }}
                            />
                            <button
                                onClick={handleGoToPage}
                                className="btn btn-success mx-2 fs-4"
                                style={{ padding: "5px 15px" }}
                            >
                                Go to
                            </button>
                        </div>
                        <button
                            className="btn"
                            style={{ backgroundColor: "#1C2D6E" }}
                            disabled={currentPage === totalPages}
                            onClick={() => handlePageChange(currentPage + 1)}
                        >
                            <img src={icons.chevronRightPinkIcon} className="right-icon icon m-2" />
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

const styles = {
    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
    },
    modalContent: {
        backgroundColor: "white",
        padding: "25px 35px",
        borderRadius: "8px",
        textAlign: "center",
    },
};

export default ManageHotels;
