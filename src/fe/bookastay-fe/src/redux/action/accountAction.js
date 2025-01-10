import axios from "~/utils/axiosCustomize";
import { userLogin, getProfile, getAvatarUrl } from "~/services/apiService";

export const USER_LOGIN_REQUEST = "USER_LOGIN_REQUEST";
export const USER_LOGIN_SUCCESS = "USER_LOGIN_SUCCESS";
export const USER_LOGIN_FAIL = "USER_LOGIN_FAIL";

export const doLogin = (email, password) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
        });

        try {
            const response = await userLogin({ email, password });
            let user = {};

            if (response && response.access_token && response.refresh_token) {
                localStorage.setItem("access_token", response.access_token);
                localStorage.setItem("refresh_token", response.refresh_token);

                user = await getProfile();

                // Lưu userId vào localStorage
                if (user?.id) {
                    localStorage.setItem("user_id", user.id);
                }

                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    user: user || {},
                    accessToken: response?.access_token || "",
                    refreshToken: response?.refresh_token || "",
                    isDoLogin: true,
                });

                return {
                    EC: 0,
                    EM: "Success",
                    DT: {
                        user,
                        accessToken: response?.access_token,
                        refreshToken: response?.refresh_token,
                    },
                };
            } else {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: response?.error?.message || "Login failed",
                    isDoLogin: true,
                });

                return {
                    EC: -1,
                    EM: response?.error?.message || "Login failed",
                    DT: {
                        user,
                        accessToken: "",
                        refreshToken: "",
                    },
                };
            }
        } catch (error) {
            console.log(">>> error: ", error);
            dispatch({
                type: USER_LOGIN_FAIL,
                error: error.message || error || "Login failed",
                isDoLogin: true,
            });

            return {
                EC: -1,
                EM: error.message || error || "Login failed",
                DT: {
                    user: {},
                    accessToken: "",
                    refreshToken: "",
                },
            };
        }
    };
};

export const doGetAccount = () => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGIN_REQUEST,
            isLoading: false,
        });

        try {
            const response = await getProfile();

            console.log(">>> response: ", response);

            const accessToken = localStorage.getItem("access_token");
            const refreshToken = localStorage.getItem("refresh_token");

            if (response && response.email && refreshToken) {
                const getAvatarUrlRes = await getAvatarUrl(response.email);

                let avatar = getAvatarUrlRes?.url || "";

                let user = {
                    ...response,
                    avatar,
                };

                dispatch({
                    type: USER_LOGIN_SUCCESS,
                    user: user || {},
                    accessToken,
                    refreshToken,
                    isLoading: false,
                });

                return {
                    EC: 0,
                    EM: "Success",
                    DT: {
                        user: response,
                        accessToken,
                        refreshToken,
                    },
                };
            } else {
                dispatch({
                    type: USER_LOGIN_FAIL,
                    error: "Access token or refresh token is invalid",
                    isLoading: false,
                });

                return {
                    EC: -1,
                    EM: "Access token or refresh token is invalid",
                    DT: {
                        user: {},
                        accessToken: "",
                        refreshToken: "",
                    },
                };
            }
        } catch (error) {
            console.log(">>> error: ", error);
            dispatch({
                type: USER_LOGIN_FAIL,
                error: error,
                isLoading: false,
            });

            return {
                EC: -1,
                EM: error,
                DT: {
                    user: {},
                    accessToken: "",
                    refreshToken: "",
                },
            };
        }
    };
};

export const USER_LOGOUT_REQUEST = "USER_LOGOUT_REQUEST";
export const USER_LOGOUT_SUCCESS = "USER_LOGOUT_SUCCESS";
export const USER_LOGOUT_FAIL = "USER_LOGOUT_FAIL";

export const doLogout = (email) => {
    return async (dispatch, getState) => {
        dispatch({
            type: USER_LOGOUT_REQUEST,
        });

        // clear local storage and redux store and cookies
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");

        dispatch({
            type: USER_LOGOUT_SUCCESS,
        });

        return {
            EC: 0,
            EM: "Success",
            DT: {},
        };
    };
};
