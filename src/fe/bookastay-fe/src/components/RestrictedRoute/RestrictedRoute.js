import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { doGetAccount } from "~/redux/action/accountAction";

const RestrictedRoute = () => {
    const userInfo = useSelector((state) => state.account.userInfo);
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);

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

    if (userInfo && userInfo.email) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default RestrictedRoute;
