import React, { useState, useEffect } from "react";
import "./manageRequests.css";
import icons from "~/assets/icon";

import axios from "~/utils/axiosCustomize";
import { updateHotelRequestStatus } from "~/services/apiService";
import { toast } from "react-toastify";

function ManageRequests() {
    const [requests, setRequests] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Số lượng request trên mỗi trang
    const [totalPages, setTotalPages] = useState(0);
    const [loading, setLoading] = useState(true);
    const [inputPage, setInputPage] = useState("");

    const handleInputPageChange = (e) => {
        setInputPage(e.target.value);
    };

    // Hàm fetch toàn bộ dữ liệu từ API
    const fetchRequests = async () => {
        setLoading(true);
        try {
            const response = await axios.get("/hotels/admin/dashboard/ga/request");

            // Cập nhật state với dữ liệu từ API
            setRequests(response);
            setTotalPages(Math.ceil(response.length / itemsPerPage));
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRequests();
    }, []);
    // Xử lý phân trang
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

    // Lấy danh sách requests cho trang hiện tại
    const currentRequests = requests.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handleUpdateStatus = async (hotelId, status) => {
        try {
            const res = await updateHotelRequestStatus(hotelId, status);

            if (res && res.status === 200) {
                toast.success("Update status successfully!", {
                    position: "top-center",
                });
                fetchRequests();
            } else {
                toast.error("Update status failed!", {
                    position: "top-center",
                });
            }
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Update status failed!", {
                position: "top-center",
            });
        }
    };

    return (
        <div className="d-flex flex-column px-5 py-3 mx-5 my-3 requests">
            <div className="d-flex justify-content-between mb-3">
                <div className="title">Requests</div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Requests</h3>
                    <h1>{requests.length}</h1>
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
                                <th>Email</th>
                                <th>Status</th>
                                <th>Address</th>
                                <th>Time</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentRequests.map((request) => (
                                <tr key={request.hotel_id}>
                                    <td>{request.hotel_id}</td>
                                    <td>{request.hotel_name}</td>
                                    <td>{request.hotel_email}</td>
                                    <td>{request.hotel_status}</td>
                                    <td>{request.location_detailAddress}</td>
                                    <td>{new Date(request.createdat).toLocaleDateString()}</td>
                                    <td>
                                        <div className="d-flex flex-column align-items-center justify-content-center w-100 h-100 gap-2">
                                            <button
                                                className="btn btn-success w-100 fs-4"
                                                style={{ padding: "5px 15px" }}
                                                onClick={() => {
                                                    handleUpdateStatus(
                                                        request.hotel_id,
                                                        "approved"
                                                    );
                                                }}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger w-100 fs-4"
                                                style={{ padding: "5px 15px" }}
                                                onClick={() => {
                                                    handleUpdateStatus(
                                                        request.hotel_id,
                                                        "rejected"
                                                    );
                                                }}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="d-flex justify-content-evenly align-items-center mt-4">
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

export default ManageRequests;
