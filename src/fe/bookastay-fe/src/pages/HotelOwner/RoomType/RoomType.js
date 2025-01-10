import { useEffect, useState } from "react";
import "./RoomType.scss";
import { Space, Table, Checkbox, Button, Popconfirm } from "antd";
import { QuestionCircleOutlined } from "@ant-design/icons";

import { useNavigate } from "react-router-dom";
import Modal from "react-bootstrap/Modal";
import { Button as BButton } from "react-bootstrap";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useSelector } from "react-redux";

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
    const [dataSource, setDataSource] = useState([
        {
            key: "1",
            roomType: "Single Room",
            roomPrice: "1000",
            roomWeekendPrice: "1200",
            roomFlexiblePrice: "800",
            isFlexiblePriceEnabled: false,
        },
        {
            key: "2",
            roomType: "Double Room",
            roomPrice: "1000",
            roomWeekendPrice: "1200",
            roomFlexiblePrice: "800",
            isFlexiblePriceEnabled: true,
        },
    ]);

    const [tableParams, setTableParams] = useState({
        pagination: { current: 1, pageSize: 10 },
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

    const handleFlexiblePriceChange = (checked, record) => {
        setDataSource((prevData) =>
            prevData.map((item) =>
                item.key === record.key ? { ...item, isFlexiblePriceEnabled: checked } : item
            )
        );
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
            title: "Action",
            key: "action",
            render: (_, record) => (
                <Space size="middle">
                    <a onClick={() => handleModalShow(record)}>Edit</a>
                    {record.roomType !== "Single Room" && record.roomType !== "Double Room" && (
                        <Popconfirm
                            onConfirm={() => {
                                // Handle delete action
                                console.log("Delete record", record);
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
                            <Button danger>Delete</Button>
                        </Popconfirm>
                    )}
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
                    ["Single Room", "Double Room"].includes(formik.values.roomType)
                }
            />
            {formik.errors[name] && formik.touched[name] && (
                <div className="invalid-feedback">{formik.errors[name]}</div>
            )}
        </div>
    );

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
                <h1 className="mb-4">Room Type</h1>
                {/* <div className="d-flex my-3">
                    <button className="btn btn-primary ms-auto fs-4" onClick={() => handleModalShow()}>
                        Add Room Type
                    </button>
                </div> */}

                <Table
                    columns={columns}
                    dataSource={dataSource}
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
                            onClick={formik.handleSubmit}
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
