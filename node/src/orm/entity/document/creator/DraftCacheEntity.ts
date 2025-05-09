import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TStepper } from "../../../../interfaces/document/creatorTypes";
import { AbstractBaseOrmEntityWithUser } from "../../../../interfaces/common/AbstractOrm";

@Entity("document_creator_draft_cache")
export class DraftCache extends AbstractBaseOrmEntityWithUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  // @Column()
  // userId: number;

  @Column({ type: "jsonb", nullable: false })
  stepper: TStepper;

  constructor() {
    super();
  }

  build(stepper: TStepper): DraftCache {
    this.uuid = stepper.uuid;
    // this.userId = userId;
    this.stepper = stepper;

    return this;
  }
}
