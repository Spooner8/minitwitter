export function useLocalDateTimeFormatter() {
    const getLocalDateTimeString = (date: Date): string => {
        return date.toLocaleString(undefined, {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return { getLocalDateTimeString };
}