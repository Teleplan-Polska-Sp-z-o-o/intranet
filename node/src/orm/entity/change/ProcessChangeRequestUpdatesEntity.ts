import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from "typeorm";
import { IProcessChangeRequestUpdates } from "../../../interfaces/change/IProcessChangeRequestUpdates";
import { IUser } from "../../../interfaces/user/UserTypes";
import { Helper } from "../../../models/common/Helper";
import { ProcessChangeRequest } from "./ProcessChangeRequestEntity";

@Entity()
export class ProcessChangeRequestUpdates implements IProcessChangeRequestUpdates {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ProcessChangeRequest, (request) => request.processChangeRequestUpdates)
  processChangeRequest: ProcessChangeRequest;

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
    processChangeRequest: ProcessChangeRequest,
    updateBy: IUser,
    updateFields: string,
    updateDescription: string
  ) => {
    this.processChangeRequest = processChangeRequest;
    this.updateBy = updateBy?.username;
    this.updateDate = Helper.formatDate(new Date());
    this.updateFields = updateFields;
    this.updateDescription = updateDescription;
  };
}
