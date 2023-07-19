import { Navigate } from "react-router-dom";

import { LS_TOKEN_KEY, APP_BASE_URL } from "common/constants/constants";

const PublicRoute = ({ children }) => {
    const token = localStorage.getItem(LS_TOKEN_KEY);

    if (token) {
        return <Navigate to={APP_BASE_URL} replace />;
    }

    return children;
};

export default PublicRoute;
