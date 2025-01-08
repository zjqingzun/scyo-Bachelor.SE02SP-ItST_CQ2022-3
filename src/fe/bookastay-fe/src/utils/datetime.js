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

export { addDays, formatDate };
