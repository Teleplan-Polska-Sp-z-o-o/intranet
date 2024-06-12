import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IPermission } from "../../../interfaces/user/IPermission";
import { TConfidentiality } from "../../../interfaces/user/TConfidentiality";

@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  read: boolean;
  @Column()
  write: boolean;
  @Column()
  control: boolean;
  @Column()
  confidentiality: TConfidentiality;

  constructor(permission: IPermission | null = null, confidentiality: TConfidentiality = "public") {
    this.read = permission?.read ?? true;
    this.write = permission?.write ?? false;
    this.control = permission?.control ?? false;
    this.confidentiality = confidentiality;
  }
}
