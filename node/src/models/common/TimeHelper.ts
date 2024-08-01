import moment from "moment-timezone";

class TimeHelper {
  constructor() {}

  /**
   * Converts an ISO date string or Date object to the local time zone of the user's system.
   *
   * @param dateInput - The ISO date string or Date object to be converted.
   * @returns The date string formatted to the local time zone of the user's system.
   */
  public static convertToLocalTime = (dateInput: string | Date): string => {
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
    isoDateString: string,
    unit: "minutes" | "hours" | "days"
  ): number => {
    const now = moment();
    const givenDate = moment(isoDateString);

    switch (unit) {
      case "minutes":
        return now.diff(givenDate, "minutes");
      case "hours":
        return now.diff(givenDate, "hours");
      case "days":
        return now.diff(givenDate, "days");
      default:
        throw new Error('Invalid unit. Please specify "minutes", "hours", or "days".');
    }
  };
}

export { TimeHelper };
