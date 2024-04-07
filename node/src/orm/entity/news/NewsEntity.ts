import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { Permission } from "../../../models/user/Permission";
import { IPermission } from "../../../interfaces/user/IPermission";

@Entity()
export class News {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  ref: string;

  @Column({ type: "jsonb" })
  permission: IPermission;

  @Column()
  title: string;

  @Column()
  subtitle: string;

  @Column()
  content: string;

  @Column()
  bgImage: string;

  constructor(
    ref: string = "",
    permission: IPermission = new Permission(),
    title: string = "",
    subtitle: string = "",
    content: string = "",
    bgImage: string = ""
  ) {
    this.ref = ref;
    this.permission = permission;
    this.title = title;
    this.subtitle = subtitle;
    this.content = content;
    this.bgImage = bgImage;
  }
}
