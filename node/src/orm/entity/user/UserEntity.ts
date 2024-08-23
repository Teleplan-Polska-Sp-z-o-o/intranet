import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToMany,
} from "typeorm";
import { UserPermission } from "./UserPermissionEntity";
import { UserSettings } from "./UserSettingsEntity";
import { UserNotification } from "./UserNotificationEntity";
import { UserInfo } from "./UserInfoEntity";
import { UserLoginDetails } from "./UserLoginDetailsEntity";
import { Document } from "../document/DocumentEntity";

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

  @OneToOne(() => UserInfo)
  @JoinColumn()
  info: UserInfo;

  @OneToMany(() => UserNotification, (notification) => notification.user)
  notification: Array<UserNotification>;

  @OneToMany(() => UserLoginDetails, (loginDetails) => loginDetails.user)
  loginDetails: Array<UserLoginDetails>;

  @ManyToMany(() => Document, (document) => document.quickAccess)
  quickAccessDocuments: Document[];

  constructor(
    username: string,
    domain: string,
    permission: UserPermission,
    settings: UserSettings,
    info: UserInfo
  ) {
    this.username = username;
    this.domain = domain;
    this.permission = permission;
    this.settings = settings;
    this.info = info;
  }
}
