const { useSelector } = require("react-redux");
const { useNavigate } = require("react-router-dom");

const PrivateRoute = ({ children, requiredRole, ...rest }) => {
    const navigate = useNavigate();

    const userRole = useSelector((state) => state.account.user.role);

    if (!userRole) {
        return navigate("/login");
    }

    if (requiredRole && requiredRole !== userRole) {
        return navigate("/");
    }

    return children;
};

export default PrivateRoute;
