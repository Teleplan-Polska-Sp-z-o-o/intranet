import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  JoinTable,
  OneToOne,
  JoinColumn,
} from "typeorm";
import { AbstractBaseOrmEntityWithUser } from "../../../../interfaces/common/AbstractBaseOrmEntity";
import { Document } from "../DocumentEntity";
import { Quiz } from "./QuizEntity";
import { AcknowledgementTypes } from "../../../../interfaces/acknowledgement/AcknowledgementTypes";

@Entity()
class ToAcknowledge
  extends AbstractBaseOrmEntityWithUser
  implements AcknowledgementTypes.IToAcknowledgeEntity
{
  @PrimaryGeneratedColumn({
    type: "int",
    comment: "Primary key of the entity",
    unsigned: true,
  })
  id: number;

  @ManyToMany(() => Document)
  @JoinTable()
  documents: Document[];

  @OneToOne(() => Quiz, { nullable: true, cascade: true })
  @JoinColumn()
  quiz: Quiz | null;

  @Column({
    type: "timestamp",
    nullable: true,
    comment: "The timestamp when the acknowledgment should start appearing after login",
  })
  acknowledgementStartDate: Date | null;

  @Column({
    type: "text",
    nullable: true,
    comment: "Description or purpose of the acknowledgment or change",
  })
  description: string;

  @Column({
    type: "boolean",
    default: false,
    comment: "Indicates if the document is related to safety",
  })
  isSafetyDocument: boolean;

  @Column({
    type: "boolean",
    default: false,
    comment: "Indicates if the acknowledgement is closed",
  })
  closed: boolean;

  @Column({
    type: "timestamp",
    nullable: true,
    comment: "The timestamp when the acknowledgement closed",
  })
  acknowledgementClosedDate: Date | null;

  constructor() {
    super();
  }

  /**
   * Updates or inserts the provided document, quiz, and start date.
   *
   * @param {Document[]} documents - The document object that will be updated or inserted.
   * @param {Quiz | null} quiz - The quiz object associated with the document. Can be `null` if no quiz is associated.
   * @param {Date | null} acknowledgementStartDate - The start date for forcing users to acknowledge the document or quiz after login. Can be `null` if no specific start date is set.
   * @returns {this} The current instance with updated or inserted values.
   */
  upsert(
    documents: Document[] | undefined,
    quiz: Quiz | null | undefined,
    description: string,
    acknowledgementStartDate: Date | null
  ): this {
    if (documents !== undefined) this.documents = documents;
    if (quiz !== undefined) this.quiz = quiz;
    this.description = description;
    this.acknowledgementStartDate = acknowledgementStartDate;

    return this;
  }

  /**
   * Updates flags related to document characteristics based on the provided source object.
   *
   * This method sets various flags for this entity, such as `isSafetyDocument`, based on
   * the properties provided in the `ofSource` parameter.
   *
   * Currently, it updates the
   * `isSafetyDocument` flag, but in the future, this method may be extended to handle
   * additional properties such as `isTrainingDocument` or others.
   *
   * @param {AcknowledgementTypes.IIs} ofSource - An object that contains the flags to be updated.
   * @returns {this} The current instance with the updated flags.
   */
  is(ofSource: AcknowledgementTypes.IIs): this {
    this.isSafetyDocument = ofSource.isSafetyDocument;
    return this;
  }

  /**
   * Marks the acknowledgment as closed.
   *
   * @returns {this} The current instance with the closed flag set to true.
   */
  close(): this {
    this.closed = true;
    this.acknowledgementClosedDate = new Date();
    return this;
  }
}

export { ToAcknowledge };
