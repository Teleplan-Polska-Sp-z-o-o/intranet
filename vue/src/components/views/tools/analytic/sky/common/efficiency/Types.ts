import { EfficiencyModels } from "./Models";

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

  export type TPackModelObj = IBaseModelObj & TTPack;
  export type TCosmModelObj = IBaseModelObj & TTCosm;
  export type TOobaModelObj = IBaseModelObj & TTOoba;

  export type IModelObj = TPackModelObj | TCosmModelObj | TOobaModelObj;

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
    efficiency: number;
    dailyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    quarterlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
  }

  export type IProcessedEmployees = IProcessedEmployee[];
}
