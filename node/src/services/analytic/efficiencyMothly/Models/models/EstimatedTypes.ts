export interface IEstimatedEmployeeTarget {
  targetUnitsPerWorkDuration: number;
  processedUnitsDelta: number;
  targetUnitsPerHour: number;
  targetUnitsPerEightHours: number | "n/a";
}
