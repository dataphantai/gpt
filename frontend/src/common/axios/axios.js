import axios from "axios";

import {
    API_BASE_URL,
    APP_LOGIN_URL,
    LS_TOKEN_KEY,
} from "common/constants/constants";

const instance = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-type": "application/json",
    },
});

instance.interceptors.response.use(
    (res) => res,
    (err) => {
        const { status } = err.response;

        if (status === 401) {
            localStorage.removeItem(LS_TOKEN_KEY);
            window.location = APP_LOGIN_URL;
        } else {
            return Promise.reject(err);
        }
    }
);

export default instance;
