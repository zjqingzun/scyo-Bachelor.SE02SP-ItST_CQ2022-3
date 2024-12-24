import { useFormik } from "formik";

import "./RoomDetail.scss";

const RoomDetail = ({ handleNext, handlePrev }) => {
    const checkValidation = () => {
        handleNext();
    };

    return (
        <div>
            <h1>Room detail</h1>

            <form action="">
                <div className="row row-cols-lg-2">
                    <div className="col">
                        <div className="mb-3">
                            <label htmlFor="roomName">Room name</label>
                            <input
                                type="text"
                                className="form-control form-control-lg fs-4"
                                id="roomName"
                                name="roomName"
                                placeholder="Enter room name"
                            />
                        </div>

                        <div className="mb-3">
                            <label htmlFor="roomType">Room type</label>
                            <select
                                className="form-select form-select-lg fs-4"
                                id="roomType"
                                name="roomType"
                            >
                                <option value="single">Single</option>
                                <option value="double">Double</option>
                                <option value="triple">Triple</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="d-flex justify-content-end gap-2">
                    <button
                        className="btn btn-secondary btn-lg fs-3 px-4"
                        style={{
                            background: "transparent",
                            border: "1px solid #227B94",
                            color: "#227B94",
                        }}
                        onClick={() => handlePrev()}
                    >
                        Back
                    </button>
                    <button
                        type="button"
                        className="btn btn-success btn-lg fs-3 px-4"
                        style={{ background: "#227B94" }}
                        onClick={() => checkValidation()}
                    >
                        Next
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RoomDetail;
