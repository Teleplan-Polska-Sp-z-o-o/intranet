import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from "typeorm";
import { INotification } from "../../../interfaces/user/notification/INotification";
import { User } from "./UserEntity";

@Entity()
export class UserNotification implements INotification {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  state: string;

  @Column()
  source: string;

  @Column()
  action: string;

  @Column()
  title: string;

  @Column({ nullable: true })
  subtitle: string | null;

  @Column()
  link: string;

  @Column()
  receivedDate: string;

  @ManyToOne(() => User, (user) => user.notification)
  user: User;

  constructor() {}

  public builder(builder: Partial<INotification>): UserNotification {
    this.state = builder.state;
    this.source = builder.source;
    this.action = builder.action;
    this.title = builder.title;
    this.subtitle = builder.subtitle;
    this.link = builder.link;
    this.receivedDate = builder.receivedDate;
    this.user = builder.user;

    return this;
  }
}
