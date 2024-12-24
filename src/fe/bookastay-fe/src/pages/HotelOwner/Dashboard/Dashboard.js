import "./Dashboard.scss";

const Dashboard = () => {
    return (
        <div className="dashboard">
            <h1>Dashboard</h1>

            <div className="dashboard__group">
                <p className="h2">Overview</p>

                <div className="dashboard__cards">
                    <div className="dashboard-card">
                        <div className="d-flex flex-column">
                            <span className="dashboard-card__label">Today's</span>
                            <div className="dashboard-card__info">
                                <span className="h2 dashboard-card__desc">Check-in</span>
                                <span className="dashboard-card__value ms-2">10</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="d-flex flex-column">
                            <span className="dashboard-card__label">Today's</span>
                            <div className="dashboard-card__info">
                                <span className="h2 dashboard-card__desc">Check-out</span>
                                <span className="dashboard-card__value ms-2">10</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="d-flex flex-column">
                            <span className="dashboard-card__label">Today's</span>
                            <div className="dashboard-card__info">
                                <span className="h2 dashboard-card__desc">Reservation</span>
                                <span className="dashboard-card__value ms-2">10</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="d-flex flex-column">
                            <span className="dashboard-card__label">Total</span>
                            <div className="dashboard-card__info">
                                <span className="h2 dashboard-card__desc">Available room</span>
                                <span className="dashboard-card__value ms-2">10</span>
                            </div>
                        </div>
                    </div>
                    <div className="dashboard-card">
                        <div className="d-flex flex-column">
                            <span className="dashboard-card__label">Total</span>
                            <div className="dashboard-card__info">
                                <span className="h2 dashboard-card__desc">Occupied room</span>
                                <span className="dashboard-card__value ms-2">10</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
