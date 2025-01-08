import { SET_CURRENCY, UPDATE_EXCHANGE_RATE } from "../action/currencyAction";

const initialState = {
    baseCurrency: "VND", // Loại tiền gốc mặc định
    currency: "VND", // Loại tiền hiển thị hiện tại
    exchangeRate: {
        VND: { VND: 1, USD: 0.000039, EUR: 0.000039 },
        USD: { USD: 1, VND: 1 / 0.000039, EUR: 0.9 },
        // ... thêm các tỉ giá khác nếu cần
    },
};

const currencyReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_CURRENCY:
            return {
                ...state,
                currency: action.payload.currency,
                baseCurrency: action.payload.baseCurrency,
            };
        case UPDATE_EXCHANGE_RATE:
            return {
                ...state,
                exchangeRate: action.payload,
            };
        default:
            return state;
    }
};

export default currencyReducer;
