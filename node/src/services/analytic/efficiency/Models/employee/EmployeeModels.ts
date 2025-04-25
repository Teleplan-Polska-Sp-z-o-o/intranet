import { EstimatedEmployeeTarget } from "../models/EstimatedModels";
import { ProcessedUnit } from "../models/ModelsModels";
import { TimePeriodMetrics } from "../time/TimeModels";
import { IEmployeeUnderProcessing, IProcessedEmployee } from "./EmployeeTypes";

export class EmployeeUnderProcessing implements IEmployeeUnderProcessing {
  id: string;
  measuredRecordIds: string[] = [];
  employeeIdentifier: string;
  employeeShift: 1 | 2 | 3;
  totalWorkDurationInMinutes: number = 0;
  totalProcessingDurationOfUnitsInMinutes: number = 0;
  totalProcessedUnits: number = 0;
  estimatedEmployeeTarget: EstimatedEmployeeTarget = new EstimatedEmployeeTarget();
  processedUnitsByModel: Map<string, ProcessedUnit> = new Map<string, ProcessedUnit>();
  efficiencyPercentage: number = 0;
  shiftChart: Map<string, TimePeriodMetrics> = new Map<string, TimePeriodMetrics>();
  dailyChart: Map<string, TimePeriodMetrics> = new Map<string, TimePeriodMetrics>();

  constructor(stringEmployeeMapKey: string, employeeIdentifier: string, shift: 1 | 2 | 3) {
    this.id = stringEmployeeMapKey;
    this.employeeIdentifier = employeeIdentifier;
    this.employeeShift = shift;
  }

  convertMapToObject(map: Map<any, any>): Record<any, any> {
    return Object.fromEntries(map.entries());
  }

  convertChartToObject(
    chart: Map<string, TimePeriodMetrics>,
    employeeQuarters?: Set<string>
  ): Record<any, any> {
    chart.forEach((metric, day) => {
      if (employeeQuarters) {
        const numberOfQuartersForDay = Array.from(employeeQuarters).filter((quarterString) =>
          quarterString.startsWith(day)
        ).length;
        metric.numberOfQuarters = numberOfQuartersForDay;
      }
      metric.calculateEfficiencyOfTimePeriod();
    });

    return Object.fromEntries(chart.entries());
  }

  private roundToTwoDecimals(num: number): number {
    return Math.round(num * 100) / 100;
  }

  transform(employeeQuarters: Set<string>): IProcessedEmployee {
    const employeeWorkedQuarters = employeeQuarters.size;
    const employeeWorkedHours = employeeQuarters.size / 4;
    const totalWorkDurationInMinutes = employeeQuarters.size * 15;

    const estimatedEmployeeTarget = this.estimatedEmployeeTarget.calculateEstimatedTarget(
      totalWorkDurationInMinutes,
      this.processedUnitsByModel
    );

    const efficiencyPercentage =
      totalWorkDurationInMinutes > 0
        ? this.roundToTwoDecimals(
            (this.totalProcessingDurationOfUnitsInMinutes / totalWorkDurationInMinutes) * 100
          )
        : 0;

    const totalProcessingDurationOfUnitsInHours =
      Math.round((this.totalProcessingDurationOfUnitsInMinutes / 60) * 10) / 10;

    return {
      id: this.id,
      measuredRecordIds: this.measuredRecordIds,
      employeeIdentifier: this.employeeIdentifier,
      employeeShift: this.employeeShift,
      employeeWorkedQuarters,
      employeeWorkedHours,
      totalWorkDurationInMinutes,
      totalProcessingDurationOfUnitsInMinutes: this.totalProcessingDurationOfUnitsInMinutes,
      totalProcessingDurationOfUnitsInHours,
      totalProcessedUnits: this.totalProcessedUnits,
      estimatedEmployeeTarget,
      processedUnitsByModel: this.convertMapToObject(this.processedUnitsByModel),
      efficiencyPercentage,
      shiftChart: this.convertChartToObject(this.shiftChart),
      dailyChart: this.convertChartToObject(this.dailyChart, employeeQuarters),
    };
  }
}
