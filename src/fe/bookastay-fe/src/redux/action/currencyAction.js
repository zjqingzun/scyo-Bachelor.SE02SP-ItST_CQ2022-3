export const SET_CURRENCY = "SET_CURRENCY";
export const UPDATE_EXCHANGE_RATE = "UPDATE_EXCHANGE_RATE";

export const setCurrency = (baseCurrency, currency) => ({
    type: SET_CURRENCY,
    payload: {
        currency,
        baseCurrency,
    },
});

export const updateExchangeRate = (exchangeRate) => ({
    type: UPDATE_EXCHANGE_RATE,
    payload: exchangeRate,
});
