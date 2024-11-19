import { CommonTypes } from "../../../../../../../interfaces/common/CommonTypes";

export namespace AnalyticRaw {
  export type TPrograms = "dell";
  export type TGroups =
    | "vmi"
    | "wffa"
    | "pack"
    | "finaltest"
    | "ecocheck"
    | "fch"
    | "repairl1l2"
    | "screening"
    | "ecoworks"
    | "oba"
    | "repairl3"
    | "scrap"
    | "hold"
    | "ship";

  export type TManager = CommonTypes.Api.GetManager &
    CommonTypes.Api.CreateFormDataManager & { program: TPrograms };
  export interface IPreFormData {
    startOfDay: Date;
    endOfDay: Date;
  }
  export interface ITransactionsRow {
    [key: string]: any;
    id: number;
    contract: string;
    username: string;
    partNo: string;
    serialNo: string;
    workStationCode: string;
    workStationDesc: string;
    nextWorkStationCode: string;
    nextWorkStationDesc: string;
    lastActivityDate: Date;
  }

  export type TTransactions = ITransactionsRow[];
}
