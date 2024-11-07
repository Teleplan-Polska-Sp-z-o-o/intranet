import { EfficiencyModels } from "./Models";

export namespace EfficiencyTypes {
  // export interface IInventoryCharacteristic {
  //   part_no: string;
  //   char_desc: string;
  //   char_val: string;
  // }

  export interface IModelMatrix {
    PART_NO: string;
    WORKSTATION: string;
    NEXT_WORKSTATION: string;
    TT: string;
  }

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
    processed_units: Set<string>;
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
}
