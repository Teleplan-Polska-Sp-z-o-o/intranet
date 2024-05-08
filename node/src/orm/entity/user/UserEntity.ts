import { Entity, Column, PrimaryGeneratedColumn, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { UserPermission } from "./UserPermissionEntity";
import { UserSettings } from "./UserSettingsEntity";
import { UserNotification } from "./UserNotificationEntity";
import { UserInfo } from "./UserInfoEntity";

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

  @OneToOne(() => UserInfo, { nullable: true })
  @JoinColumn()
  info: UserInfo;

  @OneToMany(() => UserNotification, (notification) => notification.user)
  notification: Array<UserNotification>;

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
