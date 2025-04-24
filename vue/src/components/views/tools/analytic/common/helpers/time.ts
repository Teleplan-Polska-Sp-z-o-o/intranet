import moment from "moment";
import { CommonAnalyticTypes } from "../types";

const getLast31Days = (): string[] => {
  const dates: string[] = [];

  for (let i = 0; i <= 31; i++) {
    const date = moment().subtract(i, "days").format("YYYY-MM-DD");
    dates.push(date);
  }

  return dates.reverse(); // oldest to newest (optional)
};

function shouldDisplayAsDailyChart(item: CommonAnalyticTypes.IProcessedEmployee) {
  const dailyChartDays = Object.keys(item.dailyChart).length;

  if (item.employeeShift === 3) {
    return dailyChartDays > 2;
  }

  return dailyChartDays > 1;
}

export { getLast31Days, shouldDisplayAsDailyChart };
