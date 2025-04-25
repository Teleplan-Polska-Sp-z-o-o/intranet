// import { HttpResponseMessage } from "../../../enums/response";

// export namespace EfficiencyMonthlyTypes {
//   export namespace Postgres {
//     // PROGRAM CATEGORY
//     export type ProgramCategories = {
//       [key: string]: string;
//       sky: "packing" | "cosmetic" | "ooba" | "test";
//       lenovo: "repair" | "registration" | "final" | "packing";
//       ingenico:
//         | "models"
//         | "vmi"
//         | "screening"
//         | "wintest"
//         | "finaltest"
//         // | "activation"
//         // | "customization"
//         // | "keyinjection"
//         | "fgi"
//         | "repair2"
//         | "repair3";
//       liberty:
//         | "vmi"
//         | "test"
//         | "debugrepair"
//         | "cosmetic"
//         | "highpot"
//         | "pack"
//         // | "ship"
//         | "ooba";
//     };
//     export type Program = keyof ProgramCategories;
//     export type Category<P extends Program> = ProgramCategories[P];

//     export type TT = {
//       [key: string]: string;
//       liberty:
//         | "VMI_TT"
//         | "TEST_TT"
//         | "DEB_REP_TT"
//         | "HIPOT_TT"
//         | "PACK_TT"
//         // | "SHIP_TT"
//         | "OBA_TT"
//         | "COSMETIC_1"
//         | "COSMETIC_2"
//         | "COSMETIC_3"
//         | "COSMETIC_4"
//         | "COSMETIC_5";
//       sky: "TT_PACK" | "TT_COSM" | "TT_OOBA" | "TT_TEST";
//       lenovo:
//         | "TT_REPAIR"
//         | "TT_REGISTRATION"
//         // | "TT_CLEANING"
//         | "TT_FINAL_TEST"
//         | "TT_PACKING";
//       ingenico: "TT";
//     };
//     export type TTSMap = {
//       [P in Program]: {
//         [C in ProgramCategories[P]]?: TT[P];
//       };
//     };

//     export interface ITransactionsRecord {
//       [key: string]: number | string | Date;
//       transaction_id: number;
//       contract: string;
//       order_no: string;
//       emp_name: string;
//       part_no: string;
//       work_center_no: string;
//       next_work_center_no: string;
//       datedtz: Date;
//     }
//     export type RawResponseObject = {
//       raw: ITransactionsRecord[];
//       message: string;
//       statusMessage: HttpResponseMessage;
//     };

//     interface ITimePeriodMetrics {
//       efficiency: number;
//       processing_time: number;
//       processed_units: number;
//     }

//     export interface IProcessedEmployeeUniversal {
//       id: string;
//       shift: 1 | 2 | 3;
//       emp_name: string;
//       worked_quarters: number; // Represents the total worked time in quarters of an hour
//       worked_hours: number;
//       processing_time: number; // Total processing time in minutes
//       processed_units: number | Set<string>; // Can be a count or a Set of identifiers

//       // Target and estimation details
//       estimated_target: {
//         units?: Record<string, number>; // Map of model to units (optional for flexibility)
//         part_no_processing?: Record<string, number>; // Alternative mapping for part numbers
//         units_per_worked_quarters: number; // Estimated units processed per worked time
//         difference_units_worked_time: number; // Difference between actual and estimated units
//         units_per_hr: number; // Weighted average units per hour
//         units_per_8hrs: number | "n/a"; // Weighted average for an 8-hour shift or not applicable
//       };

//       efficiency: number; // Efficiency as a percentage

//       // Time-period metrics
//       dailyChart?: Record<string, ITimePeriodMetrics>; // Daily performance metrics
//       quarterlyChart?: Record<string, ITimePeriodMetrics>; // Quarterly performance metrics
//       hourlyChart?: Record<string, ITimePeriodMetrics>; // Optional hourly metrics
//     }

//     export interface IReportsRecord {
//       [key: string]: any;
//       NAME: string;
//       SURNAME: string;
//       USERNAME: string;
//       MAIL: string | { text: string; hyperlink: string };
//       CONTENT: string; // 'EFF-MTH'
//     }
//   }
// }
