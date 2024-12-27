import axios from "axios";
import axiosRetry from "axios-retry";

const instance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,
});

// Alter defaults after instance has been created
// instance.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

axiosRetry(instance, {
    retries: 3,
    retryCondition: (error) => {
        return error.response.status === 500 || error.response.status === 419;
    },
    retryDelay: (retryCount, error) => {
        return retryCount * 1000;
    },
});

// Add a request interceptor
instance.interceptors.request.use(
    function (config) {
        // Do something before request is sent
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
            return error.response.data;
        }

        return Promise.reject(error);
    }
);

export default instance;
