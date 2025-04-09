export namespace NRecords {
  export namespace RawRecords {
    export interface IRecord {
      transaction_id: number;
      contract: string;
      order_no: string;
      emp_name: string;
      part_no: string;
      work_center_no: string;
      next_work_center_no: string;
      dated: Date;
    }

    export interface ITitanTestRecord {
      transaction_id: number;
      part_no: string;
      test_date: Date;
      serial_no: string;
      emp_hrid: string;
      box_id: string;
      hostname: string;
      test_name: string;
    }

    export type TRecords = (IRecord | ITitanTestRecord)[];

    export interface IDellBoseRecord {
      [key: string]: number | string | Date;
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
    export type TDellBoseRecords = IDellBoseRecord[];
  }

  export namespace MapRecords {
    export type MapEmployeeRecord = Map<string, RawRecords.IRecord>;
    export type MapEmployeeDellBoseRecord = Map<string, RawRecords.IDellBoseRecord>;
  }
}
