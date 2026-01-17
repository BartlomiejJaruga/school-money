import type { Location, Navigation } from 'react-router-dom';
import type { SimpleDateString } from './constants';

/**
 * Converts date in format "YYYY-MM-DD" to full ISO format.
 * @param dateString - date in format "YYYY-MM-DD"
 * @param delta - number of milliseconds added to date (default = 0)
 * @param useCurrentTime - boolean if time in date should be set to current time or set to 0 (default = false)
 */
export const formatDateToISO = (
  dateString: string,
  delta: number = 0,
  useCurrentTime: boolean = false
): string => {
  const date = new Date(dateString);

  if (useCurrentTime) {
    const now = new Date();
    date.setHours(now.getHours());
    date.setMinutes(now.getMinutes());
    date.setSeconds(now.getSeconds());
    date.setMilliseconds(now.getMilliseconds() + delta);
  }

  return date.toISOString();
};

/**
 * Converts full ISO 8601 string or Date object to "YYYY-MM-DD" format.
 * @param isoString - date in ISO format or Date object
 */
export const formatISOToDate = (isoString: string | Date): string => {
  const date = new Date(isoString);

  if (isNaN(date.getTime())) {
    return '';
  }

  return date.toISOString().split('T')[0];
};

/**
 * Converts full ISO 8601 string or Date object to "DD-MM-YYYY" format.
 * @param isoString - date in ISO format or Date object
 */
export const formatISOtoEuropeanDate = (
  isoString: string | Date
): SimpleDateString | '' => {
  const date = new Date(isoString);
  if (isNaN(date.getTime())) {
    return '';
  }

  const datePart = date.toISOString().split('T')[0];
  const [year, month, day] = datePart.split('-').map(Number);

  return `${day}.${month}.${year}` as SimpleDateString;
};

/**
 * Checks if passed paramName is changing in searchParams in between current URL state and after navigating the site.
 * Useful when there are at least 2 components in loading state when fetching their data with loader (e.g. when paginating).
 * @param navigation - Navigation from useNavigation()
 * @param location - Location from useLocation()
 * @param paramName - name of the param set in URL to check for change
 */
export const isParamChanging = (
  navigation: Navigation,
  location: Location,
  paramName: string
): boolean => {
  if (
    navigation.state !== 'loading' ||
    !navigation.location ||
    navigation.location.pathname !== location.pathname
  ) {
    return false;
  }

  const currentParams = new URLSearchParams(location.search);
  const nextParams = new URLSearchParams(navigation.location.search);

  return currentParams.get(paramName) !== nextParams.get(paramName);
};
