import { useEffect, useState, useCallback } from "react";
import { useNavigate, Navigate } from "react-router-dom";

import {
    LS_TOKEN_KEY,
    API_IS_USER_AUTHENTICATED_URL,
    APP_LOGIN_URL,
} from "common/constants/constants";
import axios from "common/axios/axios";

const AuthRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);
    const navigate = useNavigate();

    const isUserAuthenticated = useCallback(async (token) => {
        try {
            await axios.get(API_IS_USER_AUTHENTICATED_URL, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setIsAuthenticated(true);
        } catch (err) {
            localStorage.removeItem(LS_TOKEN_KEY);

            setIsAuthenticated(false);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem(LS_TOKEN_KEY);

        if (!token) {
            return navigate(APP_LOGIN_URL, {
                replace: true,
            });
        }

        isUserAuthenticated(token);
    }, [isUserAuthenticated, navigate]);

    if (isAuthenticated === null) {
        return null;
    }

    if (!isAuthenticated) {
        return <Navigate to={APP_LOGIN_URL} replace />;
    }

    return children;
};

export default AuthRoute;
