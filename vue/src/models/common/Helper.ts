import { TConfidentiality } from "../../interfaces/user/TConfidentiality";

class Helper {
  constructor() {}

  public static dateWithoutTimezone = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const withoutTimezone = new Date(date.valueOf() - tzOffset).toISOString().slice(0, -1);
    return withoutTimezone;
  };

  public static formatDate = (date: Date | string, place?: string): string => {
    if (!date) {
      if (place !== "pcr set info")
        console.warn(
          `'date' passed to Helper.formatDate evaluated to ${date}${
            place ? ` at stage: ${place} - date source: base.dateNeeded` : ""
          }`
        );
      return "";
    }

    let dateObj: Date;

    const getMonthIndex = (month: string): number => {
      const monthNames = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
      ];
      return monthNames.indexOf(month);
    };

    if (typeof date === "string") {
      const [, month, day, year] = date.split(" ");
      dateObj = new Date(Date.UTC(Number(year), getMonthIndex(month), Number(day)));
    } else {
      dateObj = date;
    }

    const day: string = (dateObj?.getDate() || 1).toString().padStart(2, "0");
    const month: string = (dateObj?.getMonth() + 1 || 1).toString().padStart(2, "0");
    const year: string = (dateObj?.getFullYear() || 1).toString().padStart(2, "0");

    const formattedDate: string = `${day}/${month}/${year}`;
    return formattedDate;
  };

  /**
   * Takes confidentiality level and returns Array of unrestricted confidentiality's.
   * Example input 'restricted' returns ["public", "restricted"] which means - Person with confidentiality 'restricted' can access content with confidentiality 'public' and 'restricted'.
   * @param {TConfidentiality} confidentiality String representing confidentiality.
   * @returns {Array<string>} Restricted confidentiality's.
   */
  public static confidentialRestriction = (confidentiality: TConfidentiality): Array<string> => {
    try {
      switch (confidentiality) {
        case "restricted":
          return ["restricted", "secret"];
        case "secret":
          return ["secret"];

        default:
          return ["public", "restricted", "secret"];
      }
    } catch (error) {
      console.error(`confidentialRestriction at Helper, ${error}`);
      return [];
    }
  };
}

export { Helper };
