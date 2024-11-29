export namespace RawTransactions {
  export interface ITransactionsRecord {
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

  export type TTransactions = ITransactionsRecord[];

  export interface ITransactionsDellBoseRecord {
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
  export type TTransactionsDellBose = ITransactionsDellBoseRecord[];
}
