import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinTable } from "typeorm";
import { AbstractBaseOrmEntityWithUser } from "../../../../interfaces/common/AbstractOrm";
import { ToAcknowledge } from "./ToAcknowledgeEntity";
import { User } from "../../user/UserEntity";

@Entity()
class UserAcknowledgement extends AbstractBaseOrmEntityWithUser {
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @OneToOne(() => ToAcknowledge)
  @JoinTable()
  toAcknowledge: ToAcknowledge;

  @OneToOne(() => User)
  @JoinTable()
  user: User;

  @Column({
    type: "boolean",
    comment: "Indicates if the document has been acknowledged",
  })
  acknowledged: boolean;

  constructor() {
    super();
  }

  /**
   * Updates or inserts the provided acknowledgment data, user, and quiz.
   *
   * @param {ToAcknowledge} toAcknowledge - The ToAcknowledge entity that the user is acknowledging.
   * @param {User} user - The User who is acknowledging the document.
   * @param {boolean} acknowledged - Indicates whether the document has been acknowledged.
   * @returns {this} The current instance with updated or inserted values.
   */
  upsert(
    toAcknowledge: ToAcknowledge | undefined,
    user: User | undefined,
    acknowledged: boolean | null
  ): this {
    if (toAcknowledge !== undefined) this.toAcknowledge = toAcknowledge;
    if (user !== undefined) this.user = user;
    this.acknowledged = acknowledged;

    return this;
  }
}

export { UserAcknowledgement };
