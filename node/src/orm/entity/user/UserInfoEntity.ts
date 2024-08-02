import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { UserInformation } from "../../../models/user/UserInformation";

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string | null;

  @Column()
  department: string | null;

  @Column()
  decisionMaker: boolean | null;

  constructor() {}

  public build(info: UserInformation) {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;

    return this;
  }
}
