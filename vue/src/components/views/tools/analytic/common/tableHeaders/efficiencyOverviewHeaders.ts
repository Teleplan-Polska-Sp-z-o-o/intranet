import { DataTableHeader } from "../../files/download/DataTableHeader";

export const overviewTableHeaders: object[] = [
  {
    title: "Shift",
    align: "center",
    key: "data-table-group",
    value: "employeeShift",
    minWidth: 99.59,
  },
  {
    title: "Employee Name",
    align: "start",
    key: "employeeIdentifier",
    value: "employeeIdentifier",
  },
  {
    title: "Worked Time (hrs)",
    align: "start",
    key: "employeeWorkedHours",
    value: "employeeWorkedHours",
  },
  {
    title: "Estimated Processing Time (hrs)",
    align: "start",
    key: "totalProcessingDurationOfUnitsInHours",
    value: "totalProcessingDurationOfUnitsInHours",
  },
  {
    title: "Units Processed",
    align: "start",
    key: "totalProcessedUnits",
    value: "totalProcessedUnits",
  },
  {
    title: "Estimated Units Processed Per Worked Time",
    align: "start",
    key: "targetUnitsPerWorkDuration",
    value: "estimatedEmployeeTarget.targetUnitsPerWorkDuration",
  },
  {
    title: "Difference Between Processed and Estimated",
    align: "start",
    key: "processedUnitsDelta",
    value: "estimatedEmployeeTarget.processedUnitsDelta",
  },
  {
    title: "Target Per Hour",
    align: "start",
    key: "targetUnitsPerHour",
    value: "estimatedEmployeeTarget.targetUnitsPerHour",
  },
  {
    title: "Target Per Shift (7.5 hrs)",
    align: "start",
    key: "targetUnitsPerEightHours",
    value: "estimatedEmployeeTarget.targetUnitsPerEightHours",
  },
  {
    title: "Efficiency (%)",
    align: "start",
    key: "efficiencyPercentage",
    value: "efficiencyPercentage",
  },
];

export const overviewTableDownloadHeaders = (overviewTableHeaders as DataTableHeader[]).filter(
  (col: DataTableHeader) => {
    const keyBlackList = ["id", "quarterlyChart", "dailyChart"];
    return !keyBlackList.includes(col.value);
  }
);
