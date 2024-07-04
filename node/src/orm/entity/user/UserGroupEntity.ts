import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from "typeorm";
import { UserPermission } from "./UserPermissionEntity";
import { UserSubgroup } from "./UserSubgroupEntity";

@Entity()
export class UserGroup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @OneToMany(() => UserSubgroup, (subgroup) => subgroup.group)
  subgroups: Array<UserSubgroup>;

  @ManyToOne(() => UserPermission, (permission) => permission.groups)
  permission: UserPermission;

  constructor() {}

  public build = (name: string, permission: UserPermission): UserGroup => {
    this.name = name;
    this.permission = permission;
    return this;
  };

  public addSubgroupToGroup = (subgroup: UserSubgroup): UserGroup => {
    if (!Array.isArray(this.subgroups) || this.subgroups.length === 0) this.subgroups = [];
    if (!this.subgroups.includes(subgroup)) this.subgroups.push(subgroup);
    return this;
  };

  public removeSubgroupFromGroup = (subgroup: UserSubgroup): UserGroup => {
    if (this.subgroups.includes(subgroup))
      this.subgroups = this.subgroups.filter((subGrp) => subGrp.id !== subgroup.id);
    return this;
  };
}
