import { Entity, Column, PrimaryColumn } from "typeorm";
import { SideAnalyticTypes } from "../../../interfaces/analytic/SideAnalyticTypes";
import * as moment from "moment-timezone";
import { ValueTransformer } from "typeorm";

const timestampTransformer: ValueTransformer = {
  to: (value: Date | string | null): Date | null => {
    if (!value) {
      return null;
    }
    return typeof value === "string" ? new Date(value) : value;
  },
  from: (value: string | Date | null): string => {
    if (!value) {
      return "";
    }
    return moment.tz(value, "Europe/Warsaw").toISOString();
  },
};

const varcharTransformer: ValueTransformer = {
  to: (value: string | null): string | null => {
    if (!value) {
      return null;
    }
    return value;
  },

  from: (value: string | null): string => {
    if (!value) {
      return "";
    }
    return value;
  },
};

@Entity({ name: "titan2_tests_results", schema: "info_emprod02" })
export class TitanTestRawTransaction implements SideAnalyticTypes.ITitanTestRawTransaction {
  @PrimaryColumn({ name: "id", type: "varchar", length: 20, transformer: varcharTransformer })
  transaction_id: string;

  @Column({ name: "model", type: "varchar", length: 100, transformer: varcharTransformer })
  part_no: string;

  @Column({ name: "testdate", type: "timestamp", precision: 0, transformer: timestampTransformer })
  test_date: Date;

  @Column({ name: "serial", type: "varchar", length: 50, transformer: varcharTransformer })
  serial_no: string;

  @Column({ name: "test_value", type: "varchar", length: 250, transformer: varcharTransformer })
  emp_hrid: string;

  @Column({ name: "box_id", type: "varchar", length: 10, transformer: varcharTransformer })
  box_id: string;

  @Column({ name: "hostname", type: "varchar", length: 100, transformer: varcharTransformer })
  hostname: string;

  @Column({ name: "test_name", type: "varchar", length: 100, transformer: varcharTransformer })
  test_name: string;
}
