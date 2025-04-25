import moment from "moment";

// Monthly: 30 days back to today at 6:00 AM
export const getMonthlyRange = (): { start: Date; end: Date } => {
  const start = moment().subtract(31, "days").toDate();
  const end = moment().add(1, "day").toDate();

  start.setHours(6, 0, 0, 0);
  end.setHours(6, 0, 0, 0);

  return { start, end };
};

// Weekly: 7 days back to today at 6:00 AM
export const getWeeklyRange = (): { start: Date; end: Date } => {
  const start = moment().subtract(7, "days").toDate();
  const end = moment().add(1, "day").toDate();

  start.setHours(6, 0, 0, 0);
  end.setHours(6, 0, 0, 0);

  return { start, end };
};
