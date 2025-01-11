import { useCallback, useEffect, useState } from "react";
import "./RoomType.scss";
import { Space, Table, Checkbox, Button, Popconfirm, Modal as AModal } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Button as BButton } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";
import { getRoomType, updatePrice, updateUseFlexiblePrice } from "~/services/apiService";
import { toast } from "react-toastify";

const INITIAL_FORM_VALUES = {
    roomType: "",
    roomPrice: "",
    roomWeekendPrice: "",
    roomFlexiblePrice: "",
};

const VALIDATION_SCHEMA = Yup.object({
    roomType: Yup.string().required("Room type is required"),
    roomPrice: Yup.number().required("Room price is required"),
    roomWeekendPrice: Yup.number().required("Weekend price is required"),
    roomFlexiblePrice: Yup.number().required("Flexible price is required"),
});

const FORM_FIELDS = [
    { name: "roomType", label: "Room Type", type: "text", placeholder: "Enter room type" },
    { name: "roomPrice", label: "Price", type: "number", placeholder: "Enter price" },
    {
        name: "roomWeekendPrice",
        label: "Weekend Price",
        type: "number",
        placeholder: "Enter weekend price",
    },
    {
        name: "roomFlexiblePrice",
        label: "Flexible Price",
        type: "number",
        placeholder: "Enter flexible price",
    },
];

const RoomType = () => {
    const userInfo = useSelector((state) => state.account.userInfo);

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState("add");

    const [roomTypes, setRoomTypes] = useState([]);

    const fetchRoomTypes = useCallback(async () => {
        try {
            setLoading(true);

            const res = await getRoomType(userInfo.hotel.id);

            if (res && res.length > 0) {
                const myRoomTypes = res.map((roomType) => ({
                    key: roomType.id,
                    roomType: +roomType.type === 2 ? "Double Room" : "Quad Room",
                    roomPrice: roomType.price,
                    roomWeekendPrice: roomType.weekend_price,
                    roomFlexiblePrice: roomType.flexible_price,
                    numberOfRooms: roomType.nums,
                    isFlexiblePriceEnabled: roomType.useFlexiblePrice,
                }));

                setRoomTypes(myRoomTypes);
            }
        } catch (error) {
            console.error("fetchRoomTypes -> error", error);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchRoomTypes();
    }, [
        fetchRoomTypes,
        userInfo.hotel && userInfo.hotel.id,
        userInfo.hotel && userInfo.hotel.id !== undefined,
    ]);

    const [tableParams, setTableParams] = useState({
        pagination: { current: 1, pageSize: 10, position: ["bottomCenter"] },
    });

    const formik = useFormik({
        initialValues: INITIAL_FORM_VALUES,
        validationSchema: VALIDATION_SCHEMA,
        onSubmit: (values) => {
            console.log(values);
            // Handle form submission
            setShowModal(false);
        },
    });

    const handleModalShow = (record = null) => {
        setModalAction(record ? "edit" : "add");
        formik.resetForm();
        if (record) {
            formik.setValues(record);
        }
        setShowModal(true);
    };

    const handleFlexiblePriceChange = async (checked, record) => {
        try {
            const res = await updateUseFlexiblePrice(
                userInfo.hotel.id,
                record.roomType === "Double Room" ? 2 : 4,
                checked
            );

            if (res && +res.status === 200) {
                fetchRoomTypes();
            }

            console.log("handleFlexiblePriceChange -> res", res);
        } catch (error) {
            console.error("handleFlexiblePriceChange -> error", error);
        }
    };

    const columns = [
        {
            title: "Room Type",
            dataIndex: "roomType",
            key: "roomType",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Price",
            dataIndex: "roomPrice",
            key: "roomPrice",
        },
        {
            title: "Weekend Price",
            dataIndex: "roomWeekendPrice",
            key: "roomWeekendPrice",
        },
        {
            title: "Flexible Price",
            dataIndex: "roomFlexiblePrice",
            key: "roomFlexiblePrice",
            render: (text, record) => (
                <Space>
                    <span>{text}</span>
                    <Checkbox
                        checked={record.isFlexiblePriceEnabled}
                        onChange={(e) => handleFlexiblePriceChange(e.target.checked, record)}
                    />
                </Space>
            ),
        },
        {
            title: "Number of Rooms",
            dataIndex: "numberOfRooms",
            key: "numberOfRooms",
        },
        {
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <Button color="primary" onClick={() => handleModalShow(record)}>
                        Edit
                    </Button>
                </Space>
            ),
        },
    ];

    const renderFormField = ({ name, label, type, placeholder }) => (
        <div className="form-group mb-3" key={name}>
            <label htmlFor={name} className="form-label form-text">
                {label}
            </label>
            <input
                type={type}
                className={`form-control form-control-lg fs-4 ${
                    formik.errors[name] && formik.touched[name] ? "is-invalid" : ""
                }`}
                id={name}
                name={name}
                placeholder={placeholder}
                value={formik.values[name]}
                onChange={formik.handleChange}
                disabled={
                    name === "roomType" &&
                    modalAction === "edit" &&
                    ["Quad Room", "Double Room"].includes(formik.values.roomType)
                }
            />
            {formik.errors[name] && formik.touched[name] && (
                <div className="invalid-feedback">{formik.errors[name]}</div>
            )}
        </div>
    );

    const handleSave = async () => {
        try {
            formik.handleSubmit();

            if (formik.isValid) {
                console.log("formik.values", formik.values);

                const type = formik.values.roomType === "Double Room" ? 2 : 4;

                const res = await updatePrice(userInfo.hotel.id, type, {
                    price: formik.values.roomPrice,
                    weekendPrice: formik.values.roomWeekendPrice,
                    flexiblePrice: formik.values.roomFlexiblePrice,
                });

                if (res && +res.status === 200) {
                    fetchRoomTypes();
                    setShowModal(false);

                    toast.success("Updated price successfully");
                }
            }
        } catch (error) {
            console.error("handleSave -> error", error);
        }
    };

    return (
        <>
            {userInfo && userInfo.hotel === undefined ? (
                <AModal
                    open={true}
                    title="Notice"
                    content="You have not registered any hotel yet. Please register your hotel first."
                    closeable={false}
                    onOk={() => navigate("/hotel-owner/register-hotel")}
                >
                    <p>You have not registered any hotel yet. Please register your hotel first.</p>
                </AModal>
            ) : null}
            <div className="room">
                <h1 className="mb-4">Room Type</h1>
                {/* <div className="d-flex my-3">
                    <button className="btn btn-primary ms-auto fs-4" onClick={() => handleModalShow()}>
                        Add Room Type
                    </button>
                </div> */}

                <Table
                    columns={columns}
                    dataSource={roomTypes}
                    scroll={{ x: "max-content" }}
                    tableLayout="auto"
                    loading={loading}
                    pagination={tableParams.pagination}
                    onChange={(pagination, filters, sorter) =>
                        setTableParams({ pagination, filters })
                    }
                />

                <Modal
                    show={showModal}
                    onHide={() => setShowModal(false)}
                    size="lg"
                    backdrop="static"
                    keyboard={false}
                    scrollable={true}
                    centered
                    fullscreen="sm-down"
                >
                    <Modal.Header closeButton>
                        <Modal.Title>
                            <span className="h2">
                                {modalAction === "edit" ? "Edit" : "Add"} Room Type
                            </span>
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <div className="px-4">{FORM_FIELDS.map(renderFormField)}</div>
                    </Modal.Body>
                    <Modal.Footer className="p-3">
                        <BButton
                            variant="secondary"
                            className="fs-4"
                            onClick={() => setShowModal(false)}
                        >
                            Close
                        </BButton>
                        <BButton
                            variant={modalAction === "edit" ? "warning" : "primary"}
                            className="fs-4"
                            onClick={() => {
                                handleSave();
                            }}
                        >
                            {modalAction === "edit" ? "Save Changes" : "Add"}
                        </BButton>
                    </Modal.Footer>
                </Modal>
            </div>
        </>
    );
};

export default RoomType;
