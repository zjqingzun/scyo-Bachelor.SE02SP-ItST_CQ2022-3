import { useEffect, useState } from "react";
import "./Room.scss";

import { Space, Table, Tag } from "antd";
import { useNavigate } from "react-router-dom";
const columns = [
    {
        title: "Room Number",
        dataIndex: "roomNumber",
        key: "roomNumber",
        render: (text) => <a>{text}</a>,
    },
    {
        title: "Room Type",
        dataIndex: "roomType",
        key: "roomType",
    },
    {
        title: "Room Price",
        dataIndex: "roomPrice",
        key: "roomPrice",
        sorter: true,
    },
    {
        title: "Status",
        key: "status",
        dataIndex: "status",
        filters: [
            {
                text: "Available",
                value: "Available",
            },
            {
                text: "Booked",
                value: "Booked",
            },
        ],
        render: (status) => (
            <>
                {status.map((tag) => {
                    let color = tag.length > 5 ? "geekblue" : "green";
                    if (tag === "Booked") {
                        color = "volcano";
                    }
                    if (tag === "Cleaning") {
                        color = "red";
                    }
                    if (tag === "Available") {
                        color = "green";
                    }
                    return (
                        <Tag color={color} key={tag}>
                            {tag.toUpperCase()}
                        </Tag>
                    );
                })}
            </>
        ),
    },
    {
        title: "Action",
        key: "action",
        render: (_, record) => (
            <Space size="middle">
                <a>Edit</a>
                <a>Delete</a>
            </Space>
        ),
    },
];
const data = [
    {
        key: "1",
        roomNumber: "#101",
        roomType: "One Bed Room",
        roomPrice: "1000",
        status: ["Available"],
    },
    {
        key: "2",
        roomNumber: "#102",
        roomType: "Two Bed Room",
        roomPrice: "1000",
        status: ["Booked"],
    },
    {
        key: "3",
        roomNumber: "#103",
        roomType: "One Bed Room",
        roomPrice: "1000",
        status: ["Available"],
    },
];

const Room = () => {
    const navigate = useNavigate();

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
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize, JSON.stringify(tableParams.filters)]);

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);

        setTableParams({
            pagination,
            filters,
        });
    };

    const handleAddRoom = () => {
        navigate("/hotel-owner/room/add-room");
    }

    return (
        <div className="room">
            <h1>Room</h1>
            <div className="d-flex my-3">
                <button className="btn btn-primary ms-auto fs-4" onClick={() => handleAddRoom()}>Add Room</button>
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
        </div>
    );
};

export default Room;
