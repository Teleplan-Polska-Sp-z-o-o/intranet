import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { UserGroup } from "./UserGroupEntity";

@Entity()
export class UserSubgroup {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  name: string;

  @ManyToOne(() => UserGroup, (group) => group.subgroups)
  group: UserGroup;

  constructor() {}

  public build = (name: string, group: UserGroup): UserSubgroup => {
    this.name = name;
    this.group = group;
    return this;
  };
}
