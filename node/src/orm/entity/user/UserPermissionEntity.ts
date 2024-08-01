import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { TConfidentiality } from "../../../interfaces/user/UserTypes";
import { UserGroup } from "./UserGroupEntity";

@Entity()
export class UserPermission {
  @PrimaryGeneratedColumn()
  id: number;
  // @Column()
  // read: boolean;
  // @Column()
  // write: boolean;
  // @Column()
  // control: boolean;
  @Column()
  confidentiality: TConfidentiality;

  @OneToMany(() => UserGroup, (group) => group.permission)
  groups: Array<UserGroup>;

  constructor(confidentiality: TConfidentiality = "public") {
    this.confidentiality = confidentiality;
  }

  public setConfidentiality(confidentiality: TConfidentiality): UserPermission {
    this.confidentiality = confidentiality;
    return this;
  }

  public addToGroup(group: UserGroup): UserPermission {
    if (!Array.isArray(this.groups) || this.groups.length === 0) this.groups = [];
    if (!this.groups.includes(group)) this.groups.push(group);
    return this;
  }

  public removeFromGroup(group: UserGroup): UserPermission {
    if (this.groups.includes(group)) this.groups = this.groups.filter((grp) => grp.id !== group.id);
    return this;
  }
}
