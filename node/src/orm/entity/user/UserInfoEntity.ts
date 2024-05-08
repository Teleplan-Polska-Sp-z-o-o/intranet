import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { Department } from "../document/DepartmentEntity";
import { UserInformation } from "../../../models/user/UserInformation";

@Entity()
export class UserInfo {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  position: string | null;

  @OneToOne(() => Department)
  @JoinColumn()
  department: Department | null;

  @Column()
  decisionMaker: boolean | null;

  constructor() {}

  public build = (info: UserInformation = new UserInformation()) => {
    this.position = info.position;
    this.department = info.department;
    this.decisionMaker = info.decisionMaker;
  };
}
