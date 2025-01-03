import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ requiredRole }) => {
    const userInfo = useSelector((state) => state.account.userInfo);

    if (!userInfo || !userInfo.role) {
        console.log("userInfo", userInfo);
        console.log("userInfo.role", userInfo.role);
        return <Navigate to="/login" />;
    }

    if (requiredRole && requiredRole !== userInfo.role) {
        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
