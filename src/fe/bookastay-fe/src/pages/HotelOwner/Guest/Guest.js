import "./Guest.scss";
import { useEffect, useRef, useState } from "react";

import { Space, Table, Tag, Button, Popconfirm, Input, Select } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";

import { useNavigate } from "react-router-dom";
import StyledStatusSelect from "./StyledStatusSelect";

const STATUS_OPTIONS = [
    { label: "Pending", value: "Pending" },
    { label: "Confirmed", value: "Confirmed" },
    { label: "Cancelled", value: "Cancelled" },
];

const getStatusColor = (status) => {
    switch (status) {
        case "Pending":
            return "volcano";
        case "Confirmed":
            return "green";
        case "Cancelled":
            return "red";
        default:
            return "geekblue";
    }
};

const data = [
    {
        key: "1",
        reservationID: "1",
        guestName: "John Doe",
        checkInDate: "2021-09-01",
        checkOutDate: "2021-09-02",
        totalPrice: "1000",
        status: ["Pending"],
    },
    {
        key: "2",
        reservationID: "2",
        guestName: "Jane Doe",
        checkInDate: "2021-09-01",
        checkOutDate: "2021-09-02",
        totalPrice: "1000",
        status: ["Confirmed"],
    },
    {
        key: "3",
        reservationID: "3",
        guestName: "John Doe",
        checkInDate: "2021-09-01",
        checkOutDate: "2021-09-02",
        totalPrice: "1000",
        status: ["Cancelled"],
    },
];

const Guest = () => {
    const navigate = useNavigate();

    const [searchText, setSearchText] = useState("");
    const [searchedColumn, setSearchedColumn] = useState("");
    const searchInput = useRef(null);
    const handleSearch = (selectedKeys, confirm, dataIndex) => {
        confirm();
        setSearchText(selectedKeys[0]);
        setSearchedColumn(dataIndex);
    };
    const handleReset = (clearFilters) => {
        clearFilters();
        setSearchText("");
    };

    const getColumnSearchProps = (dataIndex) => ({
        filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
            <div
                style={{
                    padding: 8,
                }}
                onKeyDown={(e) => e.stopPropagation()}
            >
                <Input
                    ref={searchInput}
                    placeholder={`Search ${dataIndex}`}
                    value={selectedKeys[0]}
                    onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
                    style={{
                        marginBottom: 8,
                        display: "block",
                    }}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
                        icon={<SearchOutlined />}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Search
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{
                            width: 90,
                        }}
                    >
                        Reset
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            confirm({
                                closeDropdown: false,
                            });
                            setSearchText(selectedKeys[0]);
                            setSearchedColumn(dataIndex);
                        }}
                    >
                        Filter
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        close
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered) => (
            <SearchOutlined
                style={{
                    color: filtered ? "#1677ff" : undefined,
                }}
            />
        ),
        onFilter: (value, record) =>
            record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()),
        filterDropdownProps: {
            onOpenChange(open) {
                if (open) {
                    setTimeout(() => searchInput.current?.select(), 100);
                }
            },
        },
        render: (text) =>
            searchedColumn === dataIndex ? (
                <Highlighter
                    highlightStyle={{
                        backgroundColor: "#ffc069",
                        padding: 0,
                    }}
                    searchWords={[searchText]}
                    autoEscape
                    textToHighlight={text ? text.toString() : ""}
                />
            ) : (
                text
            ),
    });

    const handleStatusChange = (recordKey, newStatus) => {
        // setData((prevData) =>
        //     prevData.map((item) => (item.key === recordKey ? { ...item, status: newStatus } : item))
        // );
    };

    const columns = [
        {
            title: "Reservation ID",
            dataIndex: "reservationID",
            key: "reservationID",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Guest Name",
            dataIndex: "guestName",
            key: "guestName",
            fixed: "left",
            ...getColumnSearchProps("guestName"),
        },
        {
            title: "Check-in Date",
            key: "checkInDate",
            dataIndex: "checkInDate",
        },
        {
            title: "Check-out Date",
            key: "checkOutDate",
            dataIndex: "checkOutDate",
        },
        {
            title: "Total Price",
            key: "totalPrice",
            dataIndex: "totalPrice",
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            filters: STATUS_OPTIONS,
            render: (status, record) => (
                <>
                    <StyledStatusSelect
                        status={status}
                        record={record}
                        handleStatusChange={handleStatusChange}
                    />
                </>
            ),
        },
        {
            title: "Action",
            key: "action",
            fixed: "right",
            render: (_, record) => (
                <Space size="middle">
                    <Button
                        type="primary"
                        onClick={() => {
                            // Handle view action
                            navigate("/hotel-owner/order-detail", { state: record });
                        }}
                    >
                        View
                    </Button>

                    <Popconfirm
                        onConfirm={() => {
                            // Handle delete action
                            console.log("Delete record", record);
                        }}
                        title="Delete the guest?"
                        description="Are you sure to delete this guest?"
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: "red",
                                }}
                            />
                        }
                    >
                        <Button danger>Delete</Button>
                    </Popconfirm>
                </Space>
            ),
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
        <div className="guest">
            <h1>Guest</h1>
            <div className="d-flex my-3">
                {/* <button className="btn btn-primary ms-auto fs-4" onClick={() => handleAddRoom()}>
                    Add Room
                </button> */}
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

export default Guest;
