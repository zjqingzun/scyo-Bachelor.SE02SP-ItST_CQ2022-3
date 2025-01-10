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

const Guest = () => {
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [totalBookings, setTotalBookings] = useState(0);

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

    const handleStatusChange = async (recordKey, newStatus) => {
        try {
            if (!recordKey) {
                console.error("Invalid record key:", recordKey);
                return;
            }
            const response = await fetch(
                `http://localhost:3001/api/booking/guest/update-status?bookingId=${recordKey}&status=${newStatus}`,
                { method: "PUT" }
            );
            const result = await response.json();
        }
        catch {
            console.log("Error when updating status");
        } finally {
            setLoading(false);
        }
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
                            navigate(`/hotel-owner/order-detail/${userId}/${record.reservationID}`, {
                                state: { reservationID: record.reservationID, userId: userId },
                            });
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

    const userId = localStorage.getItem("user_id");

    useEffect(() => {
        const fetchBookings = async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `http://localhost:3001/api/booking/guest?userId=${userId}&page=${tableParams.pagination.current}&per_page=${tableParams.pagination.pageSize}`
                );
                const result = await response.json();
                if (result.status_code === 200) {
                    const formattedData = result.data.bookings.map((booking) => ({
                        key: booking.id,
                        reservationID: booking.id,
                        guestName: booking.name,
                        checkInDate: booking.checkInDate,
                        checkOutDate: booking.checkOutDate,
                        totalPrice: booking.totalPrice,
                        status: [booking.status],
                    }));
                    setBookings(formattedData);
                    setTotalBookings(result.data.total);
                } else {
                    console.error("Failed to fetch bookings:", result.message);
                }
            } catch (error) {
                console.error("Error fetching bookings:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [tableParams.pagination.current, tableParams.pagination.pageSize]);


    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
        });
    };


    return (
        <div className="guest">
            <h1>Guest</h1>
            <div className="d-flex my-3">
            </div>
            <Table
                columns={columns}
                dataSource={bookings}
                scroll={{ x: "max-content" }}
                tableLayout="auto"
                loading={loading}
                pagination={{
                    current: tableParams.pagination.current,
                    pageSize: tableParams.pagination.pageSize,
                    total: totalBookings,
                }}
                onChange={handleTableChange}
            />
        </div>
    );
};

export default Guest;
