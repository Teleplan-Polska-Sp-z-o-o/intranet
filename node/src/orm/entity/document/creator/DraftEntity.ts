import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { TStepper } from "../../../../interfaces/document/creatorTypes";
import { AbstractBaseOrmEntityWithUser } from "../../../../interfaces/common/AbstractOrm";

@Entity("document_creator_draft")
export class Draft extends AbstractBaseOrmEntityWithUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  uuid: string;

  @Column({ type: "varchar", nullable: false })
  name: string;

  @Column({ type: "jsonb", nullable: false })
  stepper: TStepper;

  constructor() {
    super();
  }

  build(stepper: TStepper): Draft {
    this.uuid = stepper.uuid;
    this.name = stepper._name;
    // this.stepper = JSON.stringify(stepper);
    this.stepper = stepper;

    return this;
  }
}
