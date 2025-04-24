import { EfficiencyModels } from "./_Models";

export namespace EfficiencyTypes {
  interface IBaseModelObj {
    [key: string]: string;
    GROUP_NAME: string;
    GROUP_LETTER: string;
    IFS_PART_NO: string;
  }
  interface TTPack {
    [key: string]: number;
    TT_PACK: number; // Time required to pack a unit, in minutes
  }
  interface TTCosm {
    [key: string]: number;
    TT_COSM: number; // Time required to pack a unit, in minutes
  }
  interface TTOoba {
    [key: string]: number;
    TT_OOBA: number; // Time required to pack a unit, in minutes
  }
  interface TTTest {
    [key: string]: number;
    TT_TEST: number; // Time required to pack a unit, in minutes
  }

  export type TPackModelObj = IBaseModelObj & TTPack;
  export type TCosmModelObj = IBaseModelObj & TTCosm;
  export type TOobaModelObj = IBaseModelObj & TTOoba;
  export type TTestModelObj = IBaseModelObj & TTTest;

  export type IModelObj = TPackModelObj | TCosmModelObj | TOobaModelObj | TTestModelObj;

  export type IModelsObj = IModelObj[];

  export interface ITimePeriodMetrics {
    efficiency: number;
    processing_time: number;
    processed_units: number;
  }

  // Processed result per employee
  export interface IProcessedEmployee {
    id: string;
    transaction_ids: number[];
    shift: 1 | 2 | 3;
    emp_name: string;
    worked_quarters: number;
    processing_time: number;
    processed_units: number;
    //
    estimated_target: {
      units: Record<string, number>; // {model1: count, model2: count}
      units_per_worked_quarters: number;
      difference_units_worked_time: number; // Difference between processed and estimated units
      units_per_hr: number; // weighted average of units based on processing time of specific model
      units_per_8hrs: number | "n/a"; // weighted average of units based on 8 hours
    };
    //
    efficiency: number;
    dailyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    quarterlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
  }
}
