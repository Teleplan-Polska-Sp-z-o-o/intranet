import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { AbstractBaseOrmEntity } from "../../../interfaces/common/AbstractBaseOrmEntity";
import { UserTypes } from "../../../interfaces/user/UserTypes";
import { User } from "./UserEntity";

@Entity()
class UserToolStatistics extends AbstractBaseOrmEntity implements UserTypes.ToolStatistics.IFields {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @Column({
    type: "varchar",
    length: 255,
    nullable: false,
    comment: "Name of the tool used by the user",
  })
  toolName: string;

  @Column({
    type: "int",
    default: 1,
    comment: "Number of times the user has used this tool",
  })
  enterCount: number;

  @ManyToOne(() => User)
  user: User;

  constructor() {
    super();
  }

  build(toolName: string, user: User): this {
    this.toolName = toolName;
    this.user = user;

    return this;
  }

  incrementUsageCount(): this {
    this.enterCount += 1;
    return this;
  }
}

export { UserToolStatistics };
