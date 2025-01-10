import { useState, useCallback, useMemo, useRef, useEffect } from "react";
import { IoIosRemoveCircle } from "react-icons/io";
import { IoAddCircleOutline } from "react-icons/io5";
import { FaEdit } from "react-icons/fa";
import { Modal } from "antd";
import { v4 as uuidv4 } from "uuid";

import "./Room.scss";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createRoom } from "~/services/apiService";

const ROOM_TYPE = [
    { label: "Double", value: 2 },
    { label: "Quad", value: 4 },
];

const AddRoom = () => {
    const navigate = useNavigate();

    const userInfo = useSelector((state) => state.account.userInfo);

    const [roomType, setRoomType] = useState(2);
    const [numberOfRooms, setNumberOfRooms] = useState(0);
    const [startingRoomNumber, setStartingRoomNumber] = useState(1);
    const [rooms, setRooms] = useState([]);
    const [prefix, setPrefix] = useState("Room");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRooms, setSelectedRooms] = useState(new Set());

    const [openEditModal, setOpenEditModal] = useState(false);
    const editedRoomRef = useRef(null);
    const actionRef = useRef(null);

    const filteredRooms = useMemo(() => {
        return rooms.filter((room) => room.roomNumber.includes(searchTerm));
    }, [rooms, searchTerm]);

    const generateRoomNumbers = useCallback((count, start, prefix) => {
        const roomNumbers = [];
        const startingNum = parseInt(start, 10);
        for (let i = 0; i < count; i++) {
            let number = `${startingNum + i}`.padStart(3, "0");
            roomNumbers.push({ roomNumber: `${prefix}${number}`, id: uuidv4() });
        }
        setRooms(roomNumbers);
    }, []);

    const handleNumberOfRoomsChange = useCallback(
        (e) => {
            const value = Math.max(0, +e.target.value);
            setNumberOfRooms(value);
            generateRoomNumbers(value, startingRoomNumber, prefix);
        },
        [startingRoomNumber, prefix, generateRoomNumbers]
    );

    const handleStartingRoomNumberChange = useCallback(
        (e) => {
            const value = Math.max(0, +e.target.value);
            setStartingRoomNumber(value);
            generateRoomNumbers(numberOfRooms, value, prefix);
        },
        [numberOfRooms, prefix, generateRoomNumbers]
    );

    const handlePrefixChange = useCallback(
        (e) => {
            setPrefix(e.target.value);
            generateRoomNumbers(numberOfRooms, startingRoomNumber, e.target.value);
        },
        [numberOfRooms, startingRoomNumber, generateRoomNumbers]
    );

    const handleSearchChange = useCallback((e) => {
        setSearchTerm(e.target.value);
    }, []);

    const addRoom = useCallback(() => {
        actionRef.current = "add";

        setRooms((prevRooms) => {
            const maxRoomNumber = prevRooms.reduce((max, room) => {
                const roomNumber = room.roomNumber.split("-")[1];
                return Math.max(max, +roomNumber);
            }, 0);

            const newRoomNumber = maxRoomNumber + startingRoomNumber;

            return [...prevRooms, { roomNumber: `${prefix}-${newRoomNumber}`, id: uuidv4() }];
        });
        setNumberOfRooms((prevRooms) => prevRooms + 1);

        const roomList = document.getElementById("roomList");
        roomList.scrollTop = roomList.scrollHeight;
    }, [prefix, startingRoomNumber]);

    const removeRoom = useCallback((roomId) => {
        actionRef.current = "remove";

        setRooms((prevRooms) => prevRooms.filter((room) => room.id !== roomId));
        setNumberOfRooms((prevRooms) => prevRooms - 1);
        setSelectedRooms(new Set()); // Reset selected rooms
    }, []);

    const removeSelectedRooms = useCallback(() => {
        setRooms((prevRooms) => prevRooms.filter((room) => !selectedRooms.has(room.id)));
        setSelectedRooms(new Set()); // Reset selected rooms
        setNumberOfRooms((prevRooms) => prevRooms - selectedRooms.size);
    }, [selectedRooms]);

    const toggleRoomSelection = useCallback((roomId) => {
        setSelectedRooms((prevSelection) => {
            const updatedSelection = new Set(prevSelection);
            if (updatedSelection.has(roomId)) {
                updatedSelection.delete(roomId);
            } else {
                updatedSelection.add(roomId);
            }
            return updatedSelection;
        });
    }, []);

    const toggleSelectAll = useCallback(() => {
        if (selectedRooms.size === filteredRooms.length) {
            setSelectedRooms(new Set()); // Deselect all
        } else {
            const allRoomNumbers = new Set(filteredRooms.map((room) => room.id));
            setSelectedRooms(allRoomNumbers); // Select all
        }
    }, [filteredRooms, selectedRooms]);

    const updateRoomNumber = useCallback((oldRoomNumber, newRoomNumber) => {
        setRooms((prevRooms) =>
            prevRooms.map((room) =>
                room.roomNumber === oldRoomNumber ? { ...room, roomNumber: newRoomNumber } : room
            )
        );
    }, []);

    useEffect(() => {
        if (actionRef && actionRef.current) {
            if (actionRef.current === "add") {
                const roomList = document.getElementById("roomList");
                roomList.scrollTop = roomList.scrollHeight;
            }

            actionRef.current = "";
        }
    }, [rooms]);

    const showEditModal = (roomNumber) => {
        editedRoomRef.current = roomNumber;
        setOpenEditModal(true);
    };

    useEffect(() => {
        if (openEditModal) {
            document.getElementById("editedRoomInput").value = editedRoomRef.current;
        }
    }, [openEditModal]);

    const handleOk = () => {
        const newRoomNumber = document.getElementById("editedRoomInput").value;

        const isExist = rooms.some((room) => room.roomNumber === newRoomNumber);

        if (isExist) {
            toast.error("Room number already exists");
            return;
        }

        updateRoomNumber(editedRoomRef.current, newRoomNumber);

        setOpenEditModal(false);
    };

    const handleCancel = () => {
        setOpenEditModal(false);
    };

    const handleSave = async () => {
        const data = rooms.map((room) => {
            return {
                type: roomType,
                name: room.roomNumber,
            };
        });

        try {
            const res = await createRoom(userInfo.hotel.id, data);

            if (res && +res.status === 200) {
                toast.success("Room added successfully");
                navigate("/hotel-owner/room");
            } else {
                toast.error("Failed to add room");
            }
        } catch (error) {
            toast.error("Failed to add room");
        }
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
            <div className="add-room-page">
                <h1>Add Room</h1>

                <div className="card">
                    <div className="card-body">
                        <div className="add-room-page__form">
                            <div className="form-group mb-3">
                                <label className="form-label" htmlFor="roomType">
                                    Room Type
                                </label>
                                <select
                                    className="form-select form-select-lg fs-4"
                                    id="roomType"
                                    name="roomType"
                                    value={roomType}
                                    onChange={(e) => setRoomType(+e.target.value)}
                                >
                                    {ROOM_TYPE.map((item, index) => (
                                        <option key={index} value={item.value}>
                                            {item.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="row mb-3">
                                <div className="form-group col">
                                    <label className="form-label">
                                        Number of rooms of this type
                                    </label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg fs-4"
                                        name="numberRoomOfType"
                                        value={numberOfRooms}
                                        onChange={handleNumberOfRoomsChange}
                                    />
                                </div>
                                <div className="form-group col">
                                    <label className="form-label">Starting Room Number</label>
                                    <input
                                        type="number"
                                        className="form-control form-control-lg fs-4"
                                        name="startingRoomNumber"
                                        value={startingRoomNumber}
                                        onChange={handleStartingRoomNumberChange}
                                    />
                                </div>
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Room Number Prefix</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg fs-4"
                                    name="prefix"
                                    value={prefix}
                                    onChange={handlePrefixChange}
                                />
                            </div>

                            <div className="form-group mb-3">
                                <label className="form-label">Search Room</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg fs-4"
                                    placeholder="Search by Room Number"
                                    value={searchTerm}
                                    onChange={handleSearchChange}
                                />
                            </div>

                            <div className="form-group mb-3 d-flex justify-content-between">
                                <div className="form-check">
                                    <input
                                        type="checkbox"
                                        className="form-check-input"
                                        checked={
                                            selectedRooms.size === filteredRooms.length &&
                                            filteredRooms.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                    <label className="form-check-label">Select All</label>
                                </div>

                                <button
                                    type="button"
                                    onClick={removeSelectedRooms}
                                    className="btn btn-danger ml-2 fs-5"
                                >
                                    Remove Selected
                                </button>
                            </div>

                            <div
                                id="roomList"
                                style={{
                                    maxHeight: "160px",
                                    overflowY: "auto",
                                }}
                            >
                                {filteredRooms.map((room) => (
                                    <div className="form-group col-6" key={room.id}>
                                        <div className="d-flex align-items-center">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                checked={selectedRooms.has(room.id)}
                                                onChange={() => toggleRoomSelection(room.id)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control form-control-lg fs-4 ms-3"
                                                value={room.roomNumber}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => {
                                                    showEditModal(room.roomNumber);
                                                }}
                                            >
                                                <FaEdit size={30} />
                                            </button>
                                            <button
                                                type="button"
                                                className="btn"
                                                onClick={() => removeRoom(room.id)} // Xóa phòng
                                            >
                                                <IoIosRemoveCircle color="red" size={30} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="form-group">
                                <button
                                    type="button"
                                    onClick={() => {
                                        addRoom();
                                    }}
                                >
                                    <IoAddCircleOutline color="blue" size={30} />
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="card-footer">
                        <button
                            type="button"
                            className="btn btn-primary fs-3 px-5"
                            onClick={() => handleSave()}
                        >
                            Save
                        </button>
                    </div>
                </div>

                <Modal
                    title="Edit Room Number"
                    open={openEditModal}
                    onOk={handleOk}
                    onCancel={handleCancel}
                >
                    <div className="form-group">
                        <label className="form-label">Room Number</label>
                        <input
                            id="editedRoomInput"
                            type="text"
                            className="form-control form-control-lg fs-4"
                        />
                    </div>
                </Modal>
            </div>
        </>
    );
};

export default AddRoom;
