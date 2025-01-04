import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const RestrictedRoute = () => {
    const userInfo = useSelector((state) => state.account.userInfo);

    if (!userInfo || !userInfo.email) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default RestrictedRoute;
