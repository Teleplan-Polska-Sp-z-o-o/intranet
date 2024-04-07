import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn } from "typeorm";
import { UserPermission } from "./UserPermissionEntity";
import { UserSettings } from "./UserSettingsEntity";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;
  @Column()
  username: string;
  @Column()
  domain: string;

  @OneToOne(() => UserPermission)
  @JoinColumn()
  permission: UserPermission;

  @OneToOne(() => UserSettings)
  @JoinColumn()
  settings: UserSettings;

  constructor(
    username: string,
    domain: string,
    permission: UserPermission,
    settings: UserSettings
  ) {
    this.username = username;
    this.domain = domain;
    this.permission = permission;
    this.settings = settings;
  }
}
