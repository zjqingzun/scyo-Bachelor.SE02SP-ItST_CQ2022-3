import {
    USER_LOGIN_REQUEST,
    USER_LOGIN_SUCCESS,
    USER_LOGIN_FAIL,
    USER_LOGOUT_REQUEST,
    USER_LOGOUT_SUCCESS,
    USER_LOGOUT_FAIL,
} from "../action/accountAction";

const initialState = {
    userInfo: {
        id: null,
        name: "",
        dob: "",
        cccd: "",
        email: "",
        phone: "",
        avatar: null,
        role: "",
    },
    accessToken: "",
    refreshToken: "",
    isLoading: false,
    isDoLogin: false,
    errorMessage: "",
};

const accountReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_LOGIN_REQUEST:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: action.isLoading !== undefined ? action.isLoading : true,
                errorMessage: "",
                isDoLogin: action.isDoLogin || false,
            };
        case USER_LOGIN_SUCCESS:
            console.log(">>> action: ", action);
            return {
                ...state,
                userInfo: action.user,
                accessToken: action.accessToken,
                refreshToken: action.refreshToken,
                isLoading: action.isLoading !== undefined ? action.isLoading : false,
                errorMessage: "",
                isDoLogin: action.isDoLogin || false,
            };
        case USER_LOGIN_FAIL:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: action.isLoading !== undefined ? action.isLoading : false,
                errorMessage: action.error,
                isDoLogin: action.isDoLogin || false,
            };
        case USER_LOGOUT_REQUEST:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: true,
                errorMessage: "",
                isDoLogin: false,
            };
        case USER_LOGOUT_SUCCESS:
            console.log(">>> action: ", action);
            return {
                ...state,
                userInfo: {
                    email: "",
                    firstName: "",
                    lastName: "",
                    role: "",
                },
                accessToken: "",
                refreshToken: "",
                isLoading: false,
                isDoLogin: false,
                errorMessage: "",
            };
        case USER_LOGOUT_FAIL:
            console.log(">>> action: ", action);
            return {
                ...state,
                isLoading: false,
                errorMessage: action.error,
                isDoLogin: false,
            };
        default:
            return state;
    }
};

export default accountReducer;
