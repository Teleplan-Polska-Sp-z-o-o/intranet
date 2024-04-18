class Helper {
  constructor() {}

  public static dateWithoutTimezone = (date: Date) => {
    const tzOffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    const withoutTimezone = new Date(date.valueOf() - tzOffset).toISOString().slice(0, -1);
    return withoutTimezone;
  };
}

export { Helper };
