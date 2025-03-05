import { CommonTypes } from "../../../../../../interfaces/common/CommonTypes";

export namespace AnalyticRaw {
  export type TPrograms = "sky";
  export type TGroups = "packing" | "cosmetic" | "ooba" | "test";
  export type TManager = CommonTypes.Api.GetManager &
    CommonTypes.Api.CreateFormDataManager & { program: TPrograms };
  export interface IPreFormData {
    contracts: string[];
    startOfDay: Date;
    endOfDay: Date;
  }

  ///
  // OLD
  ///
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
  ///
  // NEW
  ///
  export interface ITransactionsRow {
    [key: string]: string | Date;
    transaction_id: string;
    part_no: string;
    test_date: Date;
    serial_no: string;
    emp_hrid: string;
    box_id: string;
    hostname: string;
  }
  export type TTransactions = ITransactionsRow[];
  ///
}
