import { useCallback, useEffect, useRef, useState } from "react";
import "./Room.scss";

import { Space, Table, Tag, Button, Popconfirm, Input, Modal } from "antd";
import { QuestionCircleOutlined, SearchOutlined } from "@ant-design/icons";
import Highlighter from "react-highlight-words";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { deleteRoom, getAllRooms } from "~/services/apiService";
import { toast } from "react-toastify";

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
    const userInfo = useSelector((state) => state.account.userInfo);

    const [rooms, setRooms] = useState([]);

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

    const columns = [
        {
            title: "Room Number",
            dataIndex: "roomNumber",
            key: "roomNumber",
            render: (text) => <a>{text}</a>,
            // ...getColumnSearchProps("roomNumber"),
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
            // sorter: true,
        },
        {
            title: "Status",
            key: "status",
            dataIndex: "status",
            // filters: [
            //     {
            //         text: "Available",
            //         value: "AVAILABLE",
            //     },
            //     {
            //         text: "Booked",
            //         value: "BOOKED",
            //     },
            //     {
            //         text: "Pending",
            //         value: "PENDING",
            //     },
            // ],
            render: (status) => (
                <>
                    {status.map((tag) => {
                        let color = tag.length > 5 ? "geekblue" : "green";
                        if (tag === "BOOKED") {
                            color = "volcano";
                        }
                        if (tag === "PENDING") {
                            color = "red";
                        }
                        if (tag === "AVAILABLE") {
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
                    <Popconfirm
                        onConfirm={async () => {
                            // Handle delete action
                            console.log("Delete record", record);
                            const res = await deleteRoom(record.key);

                            if (res && +res.status === 200) {
                                toast.success("Room deleted successfully");
                                fetchRooms();
                            } else {
                                toast.error("Failed to delete room");
                            }
                        }}
                        title="Delete the room type?"
                        description="Are you sure to delete this room type?"
                        icon={
                            <QuestionCircleOutlined
                                style={{
                                    color: "red",
                                }}
                            />
                        }
                    >
                        <Button
                            danger
                            onClick={() => {
                                // Handle delete action
                                console.log("Delete record", record);
                            }}
                        >
                            Delete
                        </Button>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 5,
            position: ["bottomCenter"],
        },
    });

    const fetchRooms = useCallback(async () => {
        try {
            setLoading(true);
            const res = await getAllRooms({
                hotelId: userInfo.hotel.id,
                page: tableParams.pagination?.current,
                limit: tableParams.pagination?.pageSize,
            });

            if (res && +res.status === 200) {
                let rooms = res.data.rooms.map((room) => ({
                    key: room.id,
                    roomNumber: room.name,
                    roomType: +room.type === 2 ? "Double Room" : "Quad Room",
                    roomPrice: room.price,
                    status: [room.status.toUpperCase()],
                }));

                setRooms(rooms);
                setTableParams({
                    ...tableParams,
                    pagination: {
                        ...tableParams.pagination,
                        total: res.data.total,
                    },
                });
            }
        } catch (error) {
            console.log(">>> error", error);
        } finally {
            setLoading(false);
        }
    }, [tableParams.pagination?.current, tableParams.pagination?.pageSize, userInfo.hotel.id]);

    useEffect(() => {
        if (userInfo.hotel?.id) {
            fetchRooms();
        }
    }, [fetchRooms]);

    const handleTableChange = (pagination, filters, sorter) => {
        console.log(pagination, filters, sorter);

        setTableParams({
            pagination,
            filters,
        });
    };

    const handleAddRoom = () => {
        navigate("/hotel-owner/room/add-room");
    };

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
            <div className="room">
                <h1>Room</h1>
                <div className="d-flex my-3">
                    <button
                        className="btn btn-primary ms-auto fs-4"
                        onClick={() => handleAddRoom()}
                    >
                        Add Room
                    </button>
                </div>
                <Table
                    columns={columns}
                    dataSource={rooms}
                    scroll={{ x: "max-content" }}
                    tableLayout="auto"
                    loading={loading}
                    pagination={tableParams.pagination}
                    onChange={handleTableChange}
                />
            </div>
        </>
    );
};

export default Room;
