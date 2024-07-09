import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./UserEntity";

@Entity()
export class UserLoginDetails {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.loginDetails)
  user: User;

  @CreateDateColumn()
  loginTime: Date;

  @UpdateDateColumn({ nullable: true })
  logoutTime: Date | null;

  @Column({ type: "int", default: 0 })
  duration: number; // Duration in seconds

  constructor(user: User) {
    this.user = user;
    this.logoutTime = null;
    this.duration = 0;
  }
}
