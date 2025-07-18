// Functions for working with Dates and unix timestamps

/**
 * Converts date obejct to Unix date integer
 * @param date Date object
 * @returns A Unix timestamp number
 */
export const dateToUnix = (date: Date): number => {
    return Math.floor(date.getTime() / 1000);
};

/**
 * Converts given date string to a unix date range
 * around the start and end of that day
 * @param dateString
 * @returns list of two numbers, start unix date number and end unix date number.
 */
export const dateStringToUnixRange = (dateString: string): [number, number] => {
    const startOfDay = new Date(dateString);
    const endOfDay = new Date(dateString + "T23:59:59");
    return [dateToUnix(startOfDay), dateToUnix(endOfDay)];
};

/**
 * Helper for converting from Unix date integer to date object
 * @param timestamp A Unix timestamp number
 * @returns Date object
 */
export const unixToDate = (timestamp: number): Date => {
    return new Date(timestamp * 1000);
};
