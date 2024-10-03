export namespace PackedTypes {
  export interface IModelObj {
    [key: string]: any;
    GROUP_NAME: string;
    GROUP_LETTER: string;
  }

  export type IModelObjs = IModelObj[];

  export interface IPlanObj {
    [key: string]: any;
    LINE: string; // "linia"
    DATE: Date; // "data"
    SHIFT: 1 | 2 | 3; // "zmiana"
    PACKING: number;
  }

  export type IPlanObjs = IPlanObj[];

  export interface IReportsObj {
    [key: string]: any;
    NAME: string;
    SURNAME: string;
    USERNAME: string;
    MAIL: string | { text: string; hyperlink: string };
  }

  export type IReportsObjs = IReportsObj[];

  export interface IPackedModelIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  export interface IPackedRow {
    shift: 1 | 2 | 3;
    hour: number;
    models?: Record<string, IPackedModelIndicator>;
  }

  export interface IPackedRowIndicator {
    packedUnits: number;
    targetUnits: number | "-";
    targetPercent: number | "-";
  }

  export interface IShiftsOfTransactions {
    1: TTransactionsPackingRows;
    2: TTransactionsPackingRows;
    3: TTransactionsPackingRows;
  }

  export interface IPackedRowWithModels {
    [key: string]: IPackedRowIndicator | number | string | "-";
    hour: number;
    packedUnits: number;
    shift: 1 | 2 | 3 | 4;
    targetPercent: number | "-";
    targetUnits: number | "-";
  }

  // CLONE FROM ANALYTIC RAW FOR EASIER BACKEND MANAGEMENT

  export type TPrograms = "sky";
  export type TGroups = "packing" | "cosmetic" | "ooba";
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
