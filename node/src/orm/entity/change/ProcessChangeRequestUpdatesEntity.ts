import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { IProcessChangeRequestUpdates } from "../../../interfaces/change/IProcessChangeRequestUpdates";
import { IUser } from "../../../interfaces/user/IUser";
import { Helper } from "../../../models/common/Helper";

@Entity()
export class ProcessChangeRequestUpdates implements IProcessChangeRequestUpdates {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  updateBy: string;

  @Column()
  updateDate: string;

  @Column()
  updateFields: string;

  @Column()
  updateDescription: string;

  constructor() {}

  public build = (updateBy: IUser, updateFields: string, updateDescription: string) => {
    this.updateBy = updateBy?.username;
    this.updateDate = Helper.formatDate(new Date());
    this.updateFields = updateFields;
    this.updateDescription = updateDescription;
  };
}
