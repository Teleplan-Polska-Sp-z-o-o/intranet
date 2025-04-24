import { CommonTypes } from "../../../../../../../interfaces/common/CommonTypes";
// import { EfficiencyTypes } from "../efficiency/Types";

export namespace AnalyticTypes {
  export type TPrograms = "sky";
  export type TGroups = "packing" | "cosmetic" | "ooba" | "test";
  export type TManager = CommonTypes.Api.GetManager &
    CommonTypes.Api.CreateFormDataManager & { program: TPrograms };

  // export interface IPreFormData {
  //   contracts: string[];
  //   startOfDay: Date;
  //   endOfDay: Date;
  // }
  // export interface ITransactionsRow {
  //   [key: string]: number | string | Date;
  //   transaction_id: number;
  //   contract: string;
  //   order_no: string;
  //   emp_name: string;
  //   part_no: string;
  //   work_center_no: string;
  //   next_work_center_no: string;
  //   datedtz: Date;
  // }

  // export type TTransactions = ITransactionsRow[];
  // export type TTransactionsPackingRow = ITransactionsRow & {
  //   hour: number;
  //   shift: 1 | 2 | 3;
  //   part_no_group_name: string;
  //   part_no_group_letter: string;
  //   uniqueTargetKey: string;
  //   target_for_group_letter: number | "-";
  // };
  // export type TTransactionsPackingRows = TTransactionsPackingRow[];
}

// export type IRawAndProcessedEmployees = {
//   raw: AnalyticRaw.TTransactions;
//   processed: EfficiencyTypes.IProcessedEmployees;
// };
