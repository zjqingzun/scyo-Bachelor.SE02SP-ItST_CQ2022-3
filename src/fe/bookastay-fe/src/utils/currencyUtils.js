export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRate) => {
    if (fromCurrency === toCurrency) return amount; // Không chuyển đổi nếu cùng loại tiền

    return amount * exchangeRate[fromCurrency][toCurrency];
};

export const formatCurrency = (amount, currency, baseCurrency) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
};
