import { ProcessedUnit } from "../models/ModelsModels";
import { TimePeriodMetrics } from "./TimeModels";

export namespace NTime {
  export namespace NTimePeriod {
    export interface ITimePeriodUnit {
      partNo: string;
      touchTime: number;
    }

    export interface ITimePeriodMetrics {
      readonly numberOfQuarters: number;
      efficiencyPercentage: number;
      processingTimeOfUnitsInMinutes: number;
      processedUnits: Record<string, ProcessedUnit>;
      processedCountOfUnits: number;
    }

    export interface IChartsCurrentKey {
      shiftCurrentKey: string;
      dailyCurrentKey: string;
    }

    export type TTimePeriodMetricsChart = Map<string, TimePeriodMetrics>;
  }

  export namespace NTimeUnit {
    export enum ETimeUnitType {
      Quarter = "Quarter",
      HalfHour = "HalfHour",
      ThreeQuarter = "ThreeQuarter",
      Hour = "Hour",
    }

    export interface ITimeUnit {
      readonly type: ETimeUnitType;
      readonly start: moment.Moment;
      readonly end: moment.Moment;
    }
  }
}
