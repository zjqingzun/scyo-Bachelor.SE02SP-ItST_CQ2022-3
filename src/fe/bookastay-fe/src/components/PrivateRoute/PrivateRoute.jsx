import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { doGetAccount } from "~/redux/action/accountAction";

const PrivateRoute = ({ requiredRole = [] }) => {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const userInfo = useSelector((state) => state.account.userInfo);

    useEffect(() => {
        const fetchData = async () => {
            if (userInfo && !userInfo.email) {
                await dispatch(doGetAccount());
            }
            setIsLoading(false);
        };

        fetchData();
    }, []);

    // Đợi cho đến khi fetch xong
    if (isLoading) {
        return null; // hoặc return loading spinner
    }

    if (requiredRole.length && requiredRole.includes("guest") && !userInfo) {
        // đi tiếp khi không cần login
        return <Outlet />;
    }

    if ((!userInfo || !userInfo.role) && !requiredRole.includes("guest")) {
        return <Navigate to="/login" />;
    }

    if (requiredRole.length && !requiredRole.includes(userInfo.role) && userInfo.role) {
        if (window.location.pathname === "/" || window.location.pathname === "/hotel-owner") {
            if (userInfo.role === "user") {
                return <Navigate to="/" />;
            }
            if (userInfo.role === "hotelier") {
                return <Navigate to="/hotel-owner/dashboard" />;
            }
            if (userInfo.role === "admin") {
                return <Navigate to="/admin/dashboard" />;
            }
        }

        return <Navigate to="/unauthorized" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
