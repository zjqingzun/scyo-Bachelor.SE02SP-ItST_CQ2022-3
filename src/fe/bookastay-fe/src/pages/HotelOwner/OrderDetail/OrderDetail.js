import "./OrderDetail.scss";
import { useEffect, useRef, useState } from "react";

import { Space, Table, Button, Popconfirm, Input, Descriptions, Modal, Spin } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const data = [
    {
        key: "1",
        roomNumber: "#101",
        roomType: "Double",
        price: "1000",
    },
    {
        key: "2",
        roomNumber: "#102",
        roomType: "Double",
        price: "1000",
    },
    {
        key: "3",
        roomNumber: "#103",
        roomType: "Double",
        price: "1000",
    },
];

const OrderDetail = () => {
    const navigate = useNavigate();
    const userInfo = useSelector((state) => state.account.userInfo);

    const location = useLocation();
    const { userId, reservationID } = location.state; // Lấy userId và reservationID từ state
    const [loading, setLoading] = useState(false);
    const [orderData, setOrderData] = useState(null);

    const fetchOrderDetails = async () => {
        setLoading(true);
        try {
            const response = await fetch(
                `http://localhost:3001/api/booking/guest/detail?userId=${userId}&bookingId=${reservationID}&page=1&per_page=5`
            );
            const data = await response.json();
            if (data.status_code === 200) {
                setOrderData(data.data); // Cập nhật dữ liệu đặt phòng
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
                    2: "Double",
                    3: "Suite",
                    4: "Family",
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
            <div className="order-detail">
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
                        <Descriptions.Item span={2} label="Reservation Id">
                            1
                        </Descriptions.Item>
                        <Descriptions.Item label="UserName">Zhou Maomao</Descriptions.Item>
                        <Descriptions.Item label="Telephone">1810000000</Descriptions.Item>
                    </Descriptions>
                </div>
                <Table
                    columns={columns}
                    dataSource={data}
                    scroll={{ x: "max-content" }}
                    tableLayout="auto"
                    loading={loading}
                />

                <div className="order-detail__special-request bg-white p-3 mb-5">
                    <h2>Special Request</h2>
                    <p>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, elit
                        eget fermentum faucibus, nunc odio tincidunt nunc, vel ultricies nisl ligula
                        nec erat. Nullam auctor, elit eget fermentum faucibus, nunc odio tincidunt
                        nunc, vel ultricies nisl ligula nec erat.
                    </p>
                </div>
            </div>
        </>
    );
};

export default OrderDetail;
