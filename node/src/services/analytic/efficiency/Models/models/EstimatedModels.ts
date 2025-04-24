import { IEstimatedEmployeeTarget } from "./EstimatedTypes";
import { ProcessedUnit } from "./ModelsModels";

export class EstimatedEmployeeTarget implements IEstimatedEmployeeTarget {
  targetUnitsPerWorkDuration: number = 0;
  processedUnitsDelta: number = 0;
  targetUnitsPerHour: number = 0;
  targetUnitsPerEightHours: number | "n/a" = "n/a";

  constructor() {}

  calculateEstimatedTarget(
    totalWorkDurationInMinutes: number,
    processedUnitsByModel: Map<string, ProcessedUnit>
  ): this {
    let totalProcessingTime = 0;
    let totalUnits = 0;

    // Iterate over each model and sum up processing times and unit counts
    for (const processedUnit of processedUnitsByModel.values()) {
      const processingTimePerUnit = processedUnit.tt; // Already in minutes
      const unitsCount = processedUnit.quantity;

      totalProcessingTime += processingTimePerUnit * unitsCount;
      totalUnits += unitsCount;
    }

    // Calculate weighted average processing time per unit
    const averageProcessingTimePerUnit = totalUnits > 0 ? totalProcessingTime / totalUnits : 0;

    // Calculate target units for the given total work duration
    const targetUnits =
      averageProcessingTimePerUnit > 0
        ? totalWorkDurationInMinutes / averageProcessingTimePerUnit
        : 0;

    const unitsPerHour = averageProcessingTimePerUnit > 0 ? 60 / averageProcessingTimePerUnit : 0;

    const unitsPerEightHours =
      averageProcessingTimePerUnit > 0
        ? unitsPerHour * 7.5 // 7.5 hours of effective work time
        : "n/a";

    const processedUnits = totalUnits; // Sum from processedUnitsByModel

    // Assign calculated values to class properties
    this.targetUnitsPerWorkDuration = Math.round(targetUnits);
    this.processedUnitsDelta = processedUnits - this.targetUnitsPerWorkDuration;
    this.targetUnitsPerHour = Math.round(unitsPerHour);
    this.targetUnitsPerEightHours =
      totalWorkDurationInMinutes > 60
        ? Math.round(typeof unitsPerEightHours === "number" ? unitsPerEightHours : 0)
        : "n/a";

    return this;
  }
}
