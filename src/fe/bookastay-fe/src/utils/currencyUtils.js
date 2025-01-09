import Decimal from "decimal.js";

export const convertCurrency = (amount, fromCurrency, toCurrency, exchangeRate) => {
    if (fromCurrency === toCurrency) return amount; // Không chuyển đổi nếu cùng loại tiền

    const decimalAmount = new Decimal(amount);
    const rate = new Decimal(exchangeRate[fromCurrency][toCurrency]);

    // console.log(">>> fromCurrency", fromCurrency);
    // console.log(">>> toCurrency", toCurrency);
    // console.log(">>> rate", rate.toNumber());
    // console.log(">>> decimalAmount", decimalAmount.toNumber());
    // console.log(">>> decimalAmount * rate", decimalAmount.mul(rate).toNumber());

    return decimalAmount.mul(rate).toNumber();
};

export const formatCurrency = (amount, currency, baseCurrency) => {
    const isVND = currency === "VND";

    const formattedAmount = new Intl.NumberFormat("en-US").format(amount);

    return isVND
        ? `VND ${formattedAmount}`
        : new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: currency,
          }).format(amount);
};
