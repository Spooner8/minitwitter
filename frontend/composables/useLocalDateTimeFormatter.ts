/**
 * @description
 * This composable is responsible for formatting a date object to a local date and time string.
 * 
 * @returns {Function} an object containing the function to format a date object to a local date and time string.
 */
export function useLocalDateTimeFormatter(): { getLocalDateTimeString: (date: Date) => string } {

    /**
     * @description
     * Formats a date object to a local date and time string.
     * 
     * @param {Date} date The date object to format.
     * @returns {string} The local date and time string.
     */
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