import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IUser } from "../../../interfaces/user/IUser";
import { Helper } from "../../../models/common/Helper";
import { IProcessChangeNoticeUpdates } from "../../../interfaces/change/IProcessChangeNoticeUpdates";
import { ProcessChangeNotice } from "./ProcessChangeNoticeEntity";

@Entity()
export class ProcessChangeNoticeUpdates implements IProcessChangeNoticeUpdates {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProcessChangeNotice, (request) => request.processChangeNoticeUpdates)
  processChangeNotice: ProcessChangeNotice;

  @Column()
  updateBy: string;

  @Column()
  updateDate: string;

  @Column()
  updateFields: string;

  @Column()
  updateDescription: string;

  constructor() {}

  public build = (
    processChangeNotice: ProcessChangeNotice,
    updateBy: IUser,
    updateFields: string,
    updateDescription: string
  ) => {
    this.processChangeNotice = processChangeNotice;
    this.updateBy = updateBy?.username;
    this.updateDate = Helper.formatDate(new Date());
    this.updateFields = updateFields;
    this.updateDescription = updateDescription;
  };
}
