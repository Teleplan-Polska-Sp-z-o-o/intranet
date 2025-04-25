import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { SideAnalyticTypes } from "../../../interfaces/analytic/SideAnalyticTypes";

@Entity({ name: "operation_history", schema: "public" })
export class RawTransaction implements SideAnalyticTypes.RawTransaction {
  @PrimaryGeneratedColumn()
  transaction_id: number;

  @Column({ type: "varchar", length: 5 })
  contract: string;

  @Column({ type: "varchar", length: 12 })
  order_no: string;

  @Column({ type: "text", nullable: true }) // assuming emp_name can be null
  emp_name: string;

  @Column({ type: "varchar", length: 25 })
  part_no: string;

  @Column({ type: "varchar", length: 5 })
  work_center_no: string;

  @Column({ type: "text", nullable: true }) // assuming next_work_center_no can be null
  next_work_center_no: string;

  @Column({ type: "timestamptz" }) // PostgreSQL specific type for timezone-aware timestamps
  dated: Date;
}
