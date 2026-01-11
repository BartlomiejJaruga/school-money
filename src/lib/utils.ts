import type { Location, Navigation } from 'react-router-dom';

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
  if (navigation.state !== 'loading' || !navigation.location) return false;

  const currentParams = new URLSearchParams(location.search);
  const nextParams = new URLSearchParams(navigation.location.search);

  return currentParams.get(paramName) !== nextParams.get(paramName);
};
