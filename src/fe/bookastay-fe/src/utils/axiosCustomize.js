import axios from "axios";
import axiosRetry from "axios-retry";

import { getRefreshToken } from "~/services/apiService";

const instance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

axiosRetry(instance, {
    retries: 3,
    retryCondition: async (error) => {
        console.log("error", error);
        if (error && error.response && error.response.status === 401) {
            // call to refresh token
            const refreshToken = localStorage.getItem("refresh_token");
            if (refreshToken) {
                const res = await getRefreshToken();

                localStorage.setItem("access_token", res.access_token);

                return true;
            }
        }

        return false;
    },
    retryDelay: (retryCount, error) => {
        return retryCount * 1000;
    },
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
        const token = localStorage.getItem("access_token");
        if (token) {
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    function (error) {
        // Do something with request error
        return Promise.reject(error);
    }
);

// Add a response interceptor
instance.interceptors.response.use(
    function (response) {
        // Any status code that lie within the range of 2xx cause this function to trigger
        // Do something with response data

        return response && response.data ? response.data : response;
    },
    function (error) {
        // Any status codes that falls outside the range of 2xx cause this function to trigger
        // Do something with response error

        if (error && error.response && error.response.data) {
            // call to refresh token

            return error.response.data;
        }

        return Promise.reject(error);
    }
);

export default instance;
