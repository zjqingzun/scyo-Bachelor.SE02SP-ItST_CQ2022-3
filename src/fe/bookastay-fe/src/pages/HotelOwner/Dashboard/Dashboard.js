import { useDispatch, useSelector } from "react-redux";
import { Descriptions, Modal } from "antd";
import "./Dashboard.scss";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
    getAvailableRoom,
    getOccupiedRoom,
    getTodayCheckIn,
    getTodayCheckOut,
    getTotalReservation,
} from "~/services/apiService";
import { doGetAccount } from "~/redux/action/accountAction";

const Dashboard = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const userInfo = useSelector((state) => state.account.userInfo);

    const [availableRoom, setAvailableRoom] = useState(0);
    const [occupiedRoom, setOccupiedRoom] = useState(0);
    const [totalReservation, setTotalReservation] = useState(0);
    const [todayCheckIn, setTodayCheckIn] = useState(0);
    const [todayCheckOut, setTodayCheckOut] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            if (!userInfo || !userInfo.hotel) return;

            try {
                const availableRoom = await getAvailableRoom(userInfo.hotel.id);
                setAvailableRoom(availableRoom.total);

                const occupiedRoom = await getOccupiedRoom(userInfo.hotel.id);
                setOccupiedRoom(occupiedRoom.total);

                const totalReservation = await getTotalReservation(userInfo.hotel.id);
                setTotalReservation(totalReservation.total);

                const totalCheckIn = await getTodayCheckIn(userInfo.hotel.id);
                setTodayCheckIn(totalCheckIn.total);

                const totalCheckOut = await getTodayCheckOut(userInfo.hotel.id);
                setTodayCheckOut(totalCheckOut.total);
            } catch (error) {
                console.log(error);
            }
        };

        fetchData();
    }, [userInfo]);

    useEffect(() => {
        if (userInfo && userInfo.hotel === undefined) {
            dispatch(doGetAccount());
        }
    }, []);

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
            <div className="dashboard">
                <h1>Dashboard</h1>

                <div className="d-flex my-3 bg-white p-3">
                    <Descriptions title="Hotel Information" column={2}>
                        <Descriptions.Item span={2} label="Hotel Id">
                            {userInfo.hotel?.id}
                        </Descriptions.Item>
                        <Descriptions.Item label="Hotel Name">
                            {userInfo.hotel?.name}
                        </Descriptions.Item>
                        <Descriptions.Item label="Telephone">
                            {userInfo.hotel?.phone}
                        </Descriptions.Item>
                        <Descriptions.Item label="Address">
                            {userInfo.hotel?.detailAddress || "N/A"}
                        </Descriptions.Item>
                        <Descriptions.Item label="Star">{userInfo.hotel?.star}</Descriptions.Item>
                        <Descriptions.Item label="Status">
                            {userInfo.hotel?.status}
                        </Descriptions.Item>
                    </Descriptions>
                </div>

                <div className="dashboard__group">
                    <p className="h2">Overview</p>

                    <div className="dashboard__cards">
                        <div className="dashboard-card">
                            <div className="d-flex flex-column">
                                <span className="dashboard-card__label">Today's</span>
                                <div className="dashboard-card__info">
                                    <span className="h2 dashboard-card__desc">Check-in</span>
                                    <span className="dashboard-card__value ms-2">
                                        {todayCheckIn}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="d-flex flex-column">
                                <span className="dashboard-card__label">Today's</span>
                                <div className="dashboard-card__info">
                                    <span className="h2 dashboard-card__desc">Check-out</span>
                                    <span className="dashboard-card__value ms-2">
                                        {todayCheckOut}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="d-flex flex-column">
                                <span className="dashboard-card__label">Today's</span>
                                <div className="dashboard-card__info">
                                    <span className="h2 dashboard-card__desc">Reservation</span>
                                    <span className="dashboard-card__value ms-2">
                                        {totalReservation}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="d-flex flex-column">
                                <span className="dashboard-card__label">Total</span>
                                <div className="dashboard-card__info">
                                    <span className="h2 dashboard-card__desc">Available room</span>
                                    <span className="dashboard-card__value ms-2">
                                        {availableRoom}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="dashboard-card">
                            <div className="d-flex flex-column">
                                <span className="dashboard-card__label">Total</span>
                                <div className="dashboard-card__info">
                                    <span className="h2 dashboard-card__desc">Occupied room</span>
                                    <span className="dashboard-card__value ms-2">
                                        {occupiedRoom}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Dashboard;
