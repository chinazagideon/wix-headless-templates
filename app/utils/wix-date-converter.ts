/**
 * Utility functions for converting between JavaScript Date objects and Wix date/time format
 */

/**
 * Converts a JavaScript Date object to Wix-compatible ISO string format
 * @param date - JavaScript Date object
 * @returns ISO string format compatible with Wix
 */
export const toWixDateTime = (date: Date): string => {
  return date.toISOString();
};

/**
 * Converts a Wix date/time string to JavaScript Date object
 * @param wixDateTime - Wix date/time string (ISO format)
 * @returns JavaScript Date object
 */
export const fromWixDateTime = (wixDateTime: string): Date => {
  return new Date(wixDateTime);
};

/**
 * Formats a date for display in the UI
 * @param date - JavaScript Date object
 * @returns Formatted date string for display
 */
export const formatDateForDisplay = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Formats time for display in the UI
 * @param date - JavaScript Date object
 * @returns Formatted time string for display
 */
export const formatTimeForDisplay = (date: Date): string => {
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Gets available time slots for a given date
 * @param date - JavaScript Date object
 * @returns Array of time slot strings
 */
export const getAvailableTimeSlots = (date: Date): string[] => {
  const slots: string[] = [];
  const startHour = 8; // 8 AM
  const endHour = 18; // 6 PM

  for (let hour = startHour; hour <= endHour; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeDate = new Date(date);
      timeDate.setHours(hour, minute, 0, 0);
      slots.push(
        timeDate.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: true,
        })
      );
    }
  }

  return slots;
};

/**
 * Validates if a date is available for booking (not in the past)
 * @param date - JavaScript Date object
 * @returns boolean indicating if date is available
 */
export const isDateAvailable = (date: Date): boolean => {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const selectedDate = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  return selectedDate >= today;
};
