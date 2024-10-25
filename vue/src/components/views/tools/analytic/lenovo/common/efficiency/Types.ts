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
    TT_REPAIR: number;
  }
  export type TRepairModelObj = IBaseModelObj & TTRepair;
  interface TTRegistration {
    [key: string]: number;
    TT_REGISTRATION: number;
  }
  export type TRegistrationModelObj = IBaseModelObj & TTRegistration;
  interface TTCleaning {
    [key: string]: number;
    TT_CLEANING: number;
  }
  export type TCleaningModelObj = IBaseModelObj & TTCleaning;
  interface TTFinalTest {
    [key: string]: number;
    TT_FINAL_TEST: number;
  }
  export type TFinalTestModelObj = IBaseModelObj & TTFinalTest;
  interface TTPacking {
    [key: string]: number;
    TT_PACKING: number;
  }
  export type TPackingModelObj = IBaseModelObj & TTPacking;

  export type IModelObj =
    | TRepairModelObj
    | TRegistrationModelObj
    | TCleaningModelObj
    | TFinalTestModelObj
    | TPackingModelObj;

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
    worked_quarters: number;
    processing_time: number;
    processed_units: number;
    //
    estimated_target: {
      units: Record<string, number>; // {model1: count, model2: count}
      units_per_worked_quarters: number;
      difference_units_worked_time: number;
      units_per_hr: number; // weighted average of units based on processing time of specific model
      units_per_8hrs: number; // weighted average of units based on 8 hours
    };
    //
    efficiency: number;
    dailyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    quarterlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
  }

  export type IProcessedEmployees = IProcessedEmployee[];
}
