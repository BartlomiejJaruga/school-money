/**
 * Converts date in format "YYYY-MM-DD" to full ISO format.
 * @param dateString - date in format "YYYY-MM-DD"
 * @param useCurrentTime - boolean if time in date should be set to current time or set to 0
 */
export const formatDateToISO = (
  dateString: string,
  useCurrentTime: boolean = false
): string => {
  const date = new Date(dateString);

  if (useCurrentTime) {
    const now = new Date();
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
    date.setMilliseconds(now.getMilliseconds());
  }

  return date.toISOString();
};

/**
 * Converts full ISO string or Date object to "YYYY-MM-DD" format.
 * @param isoString - date in ISO format or Date object
 */
export const formatISOToDate = (isoString: string | Date): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};
