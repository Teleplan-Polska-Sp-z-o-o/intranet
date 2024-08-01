import moment from "moment-timezone";

class TimeHelper {
  constructor() {}

  /**
   * Converts an ISO date string or Date object to the local time zone of the user's system.
   *
   * @param dateInput - The ISO date string or Date object to be converted.
   * @returns The date string formatted to the local time zone of the user's system.
   */
  public static convertToLocalTime = (dateInput: string | Date | undefined): string | undefined => {
    if (!dateInput) return undefined;
    const timezone = moment.tz.guess(); // Automatically detect the user's local timezone
    const localTime = moment.tz(dateInput, timezone).format("YYYY-MM-DD HH:mm:ssZ");
    return localTime;
  };

  /**
   * Checks how much time has passed from a given date to today.
   *
   * @param isoDateString - The ISO date string to be compared.
   * @param unit - The unit of time to return the difference in ("minutes", "hours", or "days").
   * @returns The difference in the specified unit of time.
   */
  public static timePassedSince = (
    sinceIsoDateString: string | Date | undefined,
    unit: "minutes" | "hours" | "days",
    toIsoDateString?: string | Date
  ): number | undefined => {
    if (!sinceIsoDateString) return undefined;
    const to = toIsoDateString ? moment(toIsoDateString) : moment();
    const givenDate = moment(sinceIsoDateString);

    switch (unit) {
      case "minutes":
        return to.diff(givenDate, "minutes");
      case "hours":
        return to.diff(givenDate, "hours");
      case "days":
        return to.diff(givenDate, "days");
      default:
        throw new Error('Invalid unit. Please specify "minutes", "hours", or "days".');
    }
  };
  /**
   * Removes the timezone information from an ISO date string and formats it to "YYYY-MM-DD HH:mm:ss".
   *
   * @param isoDateString - The ISO date string to be formatted.
   * @returns The formatted date string without timezone information.
   */
  public static removeTimezone = (isoDateString: string | undefined): string | undefined => {
    if (!isoDateString) return undefined;
    return moment(isoDateString).format("YYYY-MM-DD HH:mm:ss");
  };
}

export { TimeHelper };
