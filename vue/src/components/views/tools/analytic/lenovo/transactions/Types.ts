import { CommonTypes } from "../../../../../../interfaces/common/CommonTypes";

export namespace AnalyticRaw {
  export type TPrograms = "lenovo";
  export type TGroups = "repair" | "registration" | "cleaning" | "final" | "packing";
  export type TManager = CommonTypes.Api.GetManager &
    CommonTypes.Api.CreateFormDataManager & { program: TPrograms };
  export interface IPreFormData {
    startOfDay: Date;
    endOfDay: Date;
  }
  export interface ITransactionsRow {
    [key: string]: number | string | Date;
    transaction_id: number;
    contract: string;
    order_no: string;
    emp_name: string;
    part_no: string;
    work_center_no: string;
    next_work_center_no: string;
    datedtz: Date;
  }

  export type TTransactions = ITransactionsRow[];
  export type TTransactionsPackingRow = ITransactionsRow & {
    hour: number;
    shift: 1 | 2 | 3;
    part_no_group_name: string;
    part_no_group_letter: string;
    uniqueTargetKey: string;
    target_for_group_letter: number | "-";
  };
  export type TTransactionsPackingRows = TTransactionsPackingRow[];
}
