import { EfficiencyModels } from "./Models";

export namespace EfficiencyTypes {
  interface IBaseModelObj {
    [key: string]: string;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }
  interface TTRepair {
    [key: string]: number;
    TT_REPAIR: number; // Time required to pack a unit, in minutes
  }
  export type TRepairModelObj = IBaseModelObj & TTRepair;

  export type IModelObj = TRepairModelObj;

  export type IModelsObj = IModelObj[];

  export interface ITimePeriodMetrics {
    efficiency: number;
    processing_time: number;
    processed_units: number;
  }

  // Processed result per employee
  export interface IProcessedEmployee {
    id: string;
    shift: 1 | 2 | 3;
    emp_name: string;
    worked_hours: number; // Adjusted from worked_quarters to reflect hours
    processing_time: number;
    processed_units: number;
    //
    estimated_target: {
      units: Record<string, number>; // {model1: count, model2: count}
      units_per_worked_hours: number; // Adjusted to hours
      difference_units_worked_time: number;
      units_per_hr: number; // weighted average of units based on processing time of specific model
      units_per_8hrs: number; // Weighted average of units based on 8 hours
    };
    //
    efficiency: number;
    dailyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    hourlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>; // Adjusted from quarterlyChart to hourly
  }

  export type IProcessedEmployees = IProcessedEmployee[];
}
