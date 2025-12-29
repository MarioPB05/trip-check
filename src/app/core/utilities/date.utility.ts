export class DateUtility {
  /**
   * Converts a String to a Date object.
   *
   * @param dateString - The date string to convert in ISO format
   * @returns A Date object representing the given date string.
   */
  public static stringToDate(dateString: string): Date {
    return new Date(dateString);
  }

  /**
   * Converts a Date object to a String in ISO format (short version).
   *
   * @param date - The Date object to convert.
   * @returns A string representing the date in ISO format.
   */
  public static dateToISOString(date: Date): string {
    return date.toISOString().split('T')[0];
  }

  /**
   * Converts a Date object to a String in dd/mm/yyyy format.
   *
   * @param date - The Date object to convert.
   * @returns A string representing the date in dd/mm/yyyy format.
   */
  public static dateToDisplayString(date: Date): string {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  }

  /**
   * Get the difference in days between two dates in days.
   *
   * @param startDate - The start date.
   * @param endDate - The end date.
   * @returns The difference in days between the two dates.
   */
  public static dateDifferenceInDays(startDate: Date, endDate: Date): number {
    const oneDay = 24 * 60 * 60 * 1000; // hours*minutes*seconds*milliseconds
    const diffInTime = endDate.getTime() - startDate.getTime();
    return Math.ceil(diffInTime / oneDay);
  }

  /**
   * Get number of complete weeks from a number of days.
   *
   * @param days - The number of days to convert.
   * @returns The number of complete weeks.
   */
  public static daysToWeeks(days: number): number {
    return Math.floor(days / 7);
  }

  /**
   * Converts a number of days to a formatted string.
   *
   * @param days - The number of days to convert.
   * @returns A formatted string representing the number of days.
   */
  public static daysToFormattedString(days: number): string {
    if (days === 1) {
      return '1 día';
    }
    return `${days} días`;
  }

  /**
   * Converts a number of weeks to a formatted string.
   *
   * @param weeks - The number of weeks to convert.
   * @returns A formatted string representing the number of weeks.
   */
  public static weeksToFormattedString(weeks: number): string {
    if (weeks === 1) {
      return '1 semana';
    }
    return `${weeks} semanas`;
  }

  /**
   * Converts a number of months to a formatted string.
   *
   * @param months - The number of months to convert.
   * @returns A formatted string representing the number of months.
   */
  public static monthsToFormattedString(months: number): string {
    if (months === 1) {
      return '1 mes';
    }
    return `${months} meses`;
  }

  /**
   * Converts a number of years to a formatted string.
   *
   * @param years - The number of years to convert.
   * @returns A formatted string representing the number of years.
   */
  public static yearsToFormattedString(years: number): string {
    if (years === 1) {
      return '1 año';
    }
    return `${years} años`;
  }

  /**
   * Converts a number of days to a formatted string, selecting the most appropriate unit (days, weeks, months, years).
   *
   * @param days - The number of days to convert.
   * @returns A formatted string representing the number of days in the most appropriate unit.
   */
  public static daysToBestFormattedString(days: number): string {
    if (days < 7) {
      return this.daysToFormattedString(days);
    }

    const weeks = this.daysToWeeks(days);
    if (weeks < 4) {
      return this.weeksToFormattedString(weeks);
    }

    const months = Math.floor(weeks / 4);
    if (months < 12) {
      return this.monthsToFormattedString(months);
    }

    const years = Math.floor(months / 12);
    return this.yearsToFormattedString(years);
  }
}
