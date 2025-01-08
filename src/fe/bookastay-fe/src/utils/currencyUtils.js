import Decimal from "decimal.js";

export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRate) => {
    if (fromCurrency === toCurrency) return amount; // Không chuyển đổi nếu cùng loại tiền

    const decimalAmount = new Decimal(amount);
    const rate = new Decimal(exchangeRate[fromCurrency][toCurrency]);

    return decimalAmount.mul(rate).toNumber();
};

export const formatCurrency = (amount, currency, baseCurrency) => {
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: currency,
    }).format(amount);
};
