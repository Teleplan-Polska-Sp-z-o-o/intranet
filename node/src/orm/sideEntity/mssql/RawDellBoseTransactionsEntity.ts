// import { Entity, Column, PrimaryColumn } from "typeorm";

// @Entity({ schema: "pls" })
// export class RawDellBoseTransaction {
//   @PrimaryColumn()
//   id: number;

//   @Column({ name: "Contract" })
//   contract: string;

//   @Column()
//   username: string;

//   @Column({ name: "PartNo" })
//   partNo: string;

//   @Column({ name: "SerialNo" })
//   serialNo: string;

//   @Column({ name: "WorkStationCode" })
//   workStationCode: string;

//   @Column({ name: "WorkStationDesc" })
//   workStationDesc: string;

//   @Column({ name: "NextWorkStationCode" })
//   nextWorkStationCode: string;

//   @Column({ name: "NextWorkStationDesc" })
//   nextWorkStationDesc: string;

//   @Column({ name: "LastActivityDate", type: "timestamp" })
//   lastActivityDate: Date;
// }

export class RawDellBoseTransactionDTO {
  id: number;
  contract: string;
  username: string;
  partNo: string;
  serialNo: string;
  workStationDesc: string;
  nextWorkStationDesc: string;
  lastActivityDate: Date;
}
