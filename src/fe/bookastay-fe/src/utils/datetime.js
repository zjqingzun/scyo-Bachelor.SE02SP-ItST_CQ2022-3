import { format } from "date-fns";
import { enUS, vi } from "date-fns/locale";

const addDays = (date, days) => {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
};

const formatDate = (date, formatType = "dd/mm/yyyy") => {
    const d = new Date(date);
    const day = d.getDate();
    const month = d.getMonth() + 1;
    const year = d.getFullYear();
    const monthString = month < 10 ? `0${month}` : month;
    const dayString = day < 10 ? `0${day}` : day;
    switch (formatType) {
        case "dd/mm/yyyy":
            return `${dayString}-${monthString}-${year}`;
        case "yyyy-mm-dd":
            return `${year}-${monthString}-${dayString}`;
        default:
            return `${dayString}-${monthString}-${year}`;
    }
};

const formatCheckInOutDate = (dateString, locale = "vi") => {
    if (!dateString) {
        return "";
    }

    const date = new Date(dateString);
    const locales = {
        vi,
        en: enUS,
    };

    const dayOfWeek = format(date, "EEEE", { locale: locales[locale] });
    const day = format(date, "dd", { locale: locales[locale] });
    const month = format(date, "MMMM", { locale: locales[locale] });
    const year = format(date, "yyyy", { locale: locales[locale] });

    if (locale === "vi") {
        return `${dayOfWeek}, ${day} tháng ${month}, ${year}`;
    }

    return `${dayOfWeek}, ${month} ${day}, ${year}`;
};

export { addDays, formatDate, formatCheckInOutDate };
