import { EfficiencyModels } from "./Models";

export namespace EfficiencyTypes {
  export interface IModelCosmetic {
    [key: string]: string;
    /*
     * 1. Check PN group (G1-4, G5)
     * 2. Check if simple repair
     * 3. Check if hard repair
     * 4. Check if harder repair
     */
    COSMETIC_1: string; // NFF z A1070 next nie A107*
    COSMETIC_2: string; // Łatwa naprawa - next nie ma A1073 (G1, G2, G4), next nie ma A107X / A107L / A107U (G3)
    COSMETIC_3: string; // Trudna - next ma A1073 (G1, G2, G4), next ma A107X (G3)
    COSMETIC_4: string; // Trudniejsza - next nie ma A107X, ale ma A107L / A107U (G3)
    COSMETIC_5: string; // Niezdefiniowane - pozostałe
  }

  export interface IModelRecordWithoutCosmetic {
    [key: string]: string;
    IFS_PN: string;
    GROUP: string;
    VMI_TT: string;
    TEST_TT: string;
    DEB_REP_TT: string;
    HIPOT_TT: string;
    PACK_TT: string;
    SHIP_TT: string;
    OBA_TT: string;
  }

  export type IModelRecordWithCosmetic = IModelRecordWithoutCosmetic & IModelCosmetic;
  export type IModels = IModelRecordWithCosmetic[];

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
      part_no_processing: Record<string, number>;
      units: Record<string, number>;
      units_per_worked_quarters: number;
      difference_units_worked_time: number;
      units_per_hr: number;
      units_per_8hrs: number;
    };
    //
    efficiency: number;
    dailyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    // hourlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
    quarterlyChart: Record<string, EfficiencyModels.TimePeriodMetrics>;
  }

  export type IProcessedEmployees = IProcessedEmployee[];
}
