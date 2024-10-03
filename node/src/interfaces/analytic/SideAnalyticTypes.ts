export namespace SideAnalyticTypes {
  export interface RawTransaction {
    transaction_id: number;
    contract: string;
    order_no: string;
    emp_name: string;
    part_no: string;
    work_center_no: string;
    next_work_center_no: string;
    datedtz: Date;
  }

  export type RawTransactions = RawTransaction[];
}
