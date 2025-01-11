import "./OrderDetail.scss";

import { useEffect, useState } from "react";
import { Space, Table, Descriptions, Spin, Modal } from "antd";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import axios from "~/utils/axiosCustomize";

const OrderDetail = () => {
    const userInfo = useSelector((state) => state.account.userInfo);
    const navigate = useNavigate();
    const location = useLocation();
    const { userId, reservationID } = location.state; // Lấy userId và reservationID từ state
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            position: ["bottomCenter"],
        },
    });

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `/booking/guest/detail?userId=${userId}&bookingId=${reservationID}&page=${tableParams?.pagination?.current}&per_page=${tableParams?.pagination?.pageSize}`
            );
            const data = await response.json();
            if (data.status_code === 200) {
                setOrderData(data.data); // Cập nhật dữ liệu đặt phòng

                setTableParams({
                    pagination: {
                        ...tableParams.pagination,
                        current: data.data.page,
                        pageSize: data.data.per_page,
                        total: data.data.total,
                    },
                });
            } else {
                console.error("Failed to fetch order details", data.message);
            }
        } catch (error) {
            console.error("Error fetching order details:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrderDetails();
    }, [userId, reservationID]);

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);

        setTableParams({
            pagination,
        });
    };

    const columns = [
        {
            title: "Room Name",
            dataIndex: "name",
            key: "name",
        },
        {
            title: "Room Type",
            key: "type",
            dataIndex: "type",
            render: (type) => {
                const roomTypes = {
                    1: "Single",
                    2: "Double Room",
                    3: "Suite",
                    4: "Quad Room",
                };
                return roomTypes[type] || "Unknown";
            },
        },
        {
            title: "Price",
            key: "price",
            dataIndex: "price",
        },
    ];

    if (loading) {
        return (
            <div className="order-detail text-center p-5">
                <Spin size="large" />
            </div>
        );
    }

    if (!orderData) {
        return <p>No order details available</p>;
    }

    return (
        <>
            {userInfo && userInfo.hotel === undefined ? (
                <Modal
                    open={true}
                    title="Notice"
                    content="You have not registered any hotel yet. Please register your hotel first."
                    closeable={false}
                    onOk={() => navigate("/hotel-owner/register-hotel")}
                >
                    <p>You have not registered any hotel yet. Please register your hotel first.</p>
                </Modal>
            ) : null}
            <div className="order-detail">
                <h1>Order Detail</h1>
                <div className="d-flex my-3 bg-white p-3">
                    <Descriptions title="Guest Information" column={2}>
                        <Descriptions.Item label="Reservation Id">
                            {reservationID}
                        </Descriptions.Item>
                        <Descriptions.Item label="User Name">
                            {orderData.user?.name || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Email">
                            {orderData.user?.email || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Phone">
                            {orderData.user?.phone || "N/A"}
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <Table
                    columns={columns}
                    dataSource={orderData.bookingRooms.map((room, index) => ({
                        key: index,
                        ...room,
                    }))}
                    scroll={{ x: "max-content" }}
                    tableLayout="auto"
                    loading={loading}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                />

                <div className="order-detail__special-request bg-white p-3 mb-5">
                    <h2>Special Request</h2>
                    <p>{orderData.note || "No special requests"}</p>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
