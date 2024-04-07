import { Entity, Column, PrimaryGeneratedColumn } from "typeorm";
import { IPermission } from "../../../interfaces/user/IPermission";

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

  constructor(permission: IPermission | null = null) {
    this.read = permission?.read ?? true;
    this.write = permission?.write ?? false;
    this.control = permission?.control ?? false;
  }
}
