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

  export interface ITitanTestRawTransaction {
    transaction_id: string;
    part_no: string;
    test_date: Date;
    serial_no: string;
    emp_hrid: string;
    box_id: string;
    hostname: string;
    test_name: string;
  }

  export type TTitanTestRawTransactions = ITitanTestRawTransaction[];
}
