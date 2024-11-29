import { EfficiencyModels } from "./Models";

export namespace EfficiencyTypes {
  export enum WorkStationMapping {
    VMI = "gTask1",
    WFFA = "gTask0",
    PACK = "gTask8",
    FINALTEST = "gTest1",
    ECOCHECK = "gTask2",
    FCH = "gTask3",
    REPAIRL1L2 = "gTask5",
    SCREENING = "gTest0",
    ECOWORKS = "gTask7",
    OBA = "gTask9",
    REPAIRL3 = "gTask6",
    SCRAP = "Scrap",
    HOLD = "gTask12",
    SHIP = "gTask10",
  }

  export interface IModelRecord {
    WORKSTATION_DESC: string;
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
}
