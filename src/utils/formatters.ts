/**
 * Formats an ISO date string using Intl.DateTimeFormat.
 */
export function formatDateTime(isoString: string, locale: string = 'en'): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const intlLocale = locale === 'hi' ? 'hi-IN' : 'en-US';
    return new Intl.DateTimeFormat(intlLocale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

/**
 * Formats a short date string using Intl.DateTimeFormat.
 */
export function formatDateOnly(isoString: string, locale: string = 'en'): string {
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;

    const intlLocale = locale === 'hi' ? 'hi-IN' : 'en-US';
    return new Intl.DateTimeFormat(intlLocale, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    }).format(date);
  } catch (e) {
    return isoString;
  }
}

/**
 * Formats numbers using Intl.NumberFormat.
 */
export function formatNumber(value: number, locale: string = 'en'): string {
  try {
    const intlLocale = locale === 'hi' ? 'hi-IN' : 'en-US';
    return new Intl.NumberFormat(intlLocale).format(value);
  } catch (e) {
    return String(value);
  }
}
