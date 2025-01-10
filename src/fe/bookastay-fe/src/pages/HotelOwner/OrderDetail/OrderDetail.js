import "./OrderDetail.scss";
import { useEffect, useRef, useState } from "react";

import { Space, Table, Button, Popconfirm, Input, Descriptions } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { useNavigate } from "react-router-dom";

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
    const columns = [
        {
            title: "Room Number",
            dataIndex: "roomNumber",
            key: "roomNumber",
        },
        {
            title: "Room Type",
            key: "roomType",
            dataIndex: "roomType",
        },
        {
            title: "Price",
            key: "price",
            dataIndex: "price",
        },
    ];

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    useEffect(() => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [
        tableParams.pagination?.current,
        tableParams.pagination?.pageSize,
        JSON.stringify(tableParams.filters),
    ]);

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);

        setTableParams({
            pagination,
            filters,
        });
    };

    // const handleAddRoom = () => {
    //     navigate("/hotel-owner/room/add-room");
    // };

    return (
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
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />

            <div className="order-detail__special-request bg-white p-3 mb-5">
                <h2>Special Request</h2>
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, elit
                    eget fermentum faucibus, nunc odio tincidunt nunc, vel ultricies nisl ligula nec
                    erat. Nullam auctor, elit eget fermentum faucibus, nunc odio tincidunt nunc, vel
                    ultricies nisl ligula nec erat.
                </p>
            </div>
        </div>
    );
};

export default OrderDetail;
