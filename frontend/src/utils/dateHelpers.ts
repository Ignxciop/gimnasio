const MONTH_NAMES = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
] as const;

export const getMonthName = (month: number): string => {
    if (month < 1 || month > 12) {
        throw new Error("Month must be between 1 and 12");
    }
    return MONTH_NAMES[month - 1];
};

export const formatTime = (seconds: number): string => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hrs > 0) {
        return `${hrs}:${mins.toString().padStart(2, "0")}:${secs
            .toString()
            .padStart(2, "0")}`;
    }
    return `${mins}:${secs.toString().padStart(2, "0")}`;
};

export const getCurrentYear = (): number => new Date().getFullYear();

export const getCurrentMonth = (): number => new Date().getMonth() + 1;

export const formatDateDisplay = (date: Date): string => {
    const day = date.getDate();
    const month = getMonthName(date.getMonth() + 1);
    const year = date.getFullYear();
    return `${day} de ${month} de ${year}`;
};
