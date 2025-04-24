export namespace CommonAnalyticTypes {
  export interface IPreFormData {
    contracts: string[];
    startOfDay: Date;
    endOfDay: Date;
  }

  export interface IRawTransaction {
    [key: string]: number | string | Date;
    transaction_id: number;
    contract: string;
    order_no: string;
    emp_name: string;
    part_no: string;
    work_center_no: string;
    next_work_center_no: string;
    datedtz: Date;
  }

  export interface IProcessedUnit {
    quantity: number;
    tt: number;
  }
  interface IEstimatedEmployeeTarget {
    targetUnitsPerWorkDuration: number;
    processedUnitsDelta: number;
    targetUnitsPerHour: number;
    targetUnitsPerEightHours: number | "n/a";
  }
  export interface ITimePeriodMetrics {
    readonly numberOfQuarters: number;
    efficiencyPercentage: number;
    processingTimeOfUnitsInMinutes: number;
    processedUnits: Record<string, IProcessedUnit>;
    processedCountOfUnits: number;
  }
  export interface IProcessedEmployee {
    id: string;
    measuredRecordIds: string[];
    employeeIdentifier: string;
    employeeShift: 1 | 2 | 3;
    employeeWorkedHours: number;
    employeeWorkedQuarters: number;
    totalWorkDurationInMinutes: number;
    totalProcessingDurationOfUnitsInMinutes: number;
    totalProcessingDurationOfUnitsInHours: number;
    processedUnitsByModel: Record<string, IProcessedUnit>;
    totalProcessedUnits: number;
    estimatedEmployeeTarget: IEstimatedEmployeeTarget;
    efficiencyPercentage: number;
    shiftChart: Record<string, ITimePeriodMetrics>;
    dailyChart: Record<string, ITimePeriodMetrics>;
  }

  export interface IMissingCache {
    id: number;
    cacheKey: string;
    touchTimeKey: string;
  }

  export interface IAnalyticModelResponse {
    raw: IRawTransaction[];
    processed: IProcessedEmployee[];
    missingCache: IMissingCache[];
  }
}
