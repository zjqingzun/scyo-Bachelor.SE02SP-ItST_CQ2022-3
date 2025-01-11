import { useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import "./dashboard.css";

import axios from "~/utils/axiosCustomize";

function Dashboard() {
    const [applications, setApplications] = useState([]); // Chỉ lưu 7 request mới nhất
    const [totals, setTotals] = useState({
        hotels: 0,
        users: 0,
        requests: 0,
    });

    const navigate = useNavigate();

    const handleRowClick = (app) => {
        navigate(`/admin/request/${app.id}`);
    };
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            // Fetch totals
            const hotelsResponse = await axios.get("http://localhost:3001/api/hotels/getAll");
            const hotelsData = hotelsResponse;

            const usersResponse = await axios.get("/user/getAll/user");
            const usersData = usersResponse;

            const requestsResponse = await axios.get("/hotels/admin/dashboard/t/request");
            const requestsData = requestsResponse;

            setTotals({
                hotels: hotelsData.total || 0,
                users: usersData.total || 0,
                requests: requestsData.total || 0,
            });

            // Fetch latest 7 applications
            const latestRequestsResponse = await fetch(
                "http://localhost:3001/api/hotels/admin/dashboard/ga/request"
            );
            const latestRequestsData = await latestRequestsResponse.json();

            setApplications(latestRequestsData.slice(0, 7)); // Lấy 7 request đầu tiên
        } catch (error) {
            console.error("Error fetching dashboard data:", error);
        }
    };

    return (
        <div className="dashboard d-flex flex-column px-5 py-3 m-5">
            <div className="title mb-4">Dashboard</div>
            <div className="d-flex justify-content-between mb-5">
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Hotels</h3>
                    <h1>{totals.hotels}</h1>
                </div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Users</h3>
                    <h1>{totals.users}</h1>
                </div>
                <div className="text-white p-4 rounded text-center box" style={{ width: "20%" }}>
                    <h3>Total Requests</h3>
                    <h1>{totals.requests}</h1>
                </div>
            </div>
            <div className="applications">
                <h3>New Requests</h3>
                <table className="table table-hover">
                    <thead className="table-dark fs-3">
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Created At</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((app) => (
                            <tr key={app.hotel_id} onClick={() => handleRowClick(app)}>
                                <td>{app.hotel_id}</td>
                                <td>{app.hotel_name}</td>
                                <td>{app.hotel_email}</td>
                                <td>{new Date(app.createdat).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <button className="px-4 mt-4" onClick={() => navigate("/admin/manage-requests")}>
                    See more
                </button>
            </div>
        </div>
    );
}

export default Dashboard;
