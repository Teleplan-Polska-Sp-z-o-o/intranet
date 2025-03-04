import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";
import { AbstractBaseOrmEntityWithUser } from "../../../../interfaces/common/AbstractOrm";

@Entity("ms_translator_usage")
export class MSTranslatorUsage extends AbstractBaseOrmEntityWithUser {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "int", default: 0, nullable: false })
  charactersUsed: number; // Number of free characters used

  @Column({ type: "boolean", nullable: false })
  resultedInError: boolean; // Whether the request resulted in an error

  @Column({ type: "text", nullable: true })
  errorMessage: string | null; // Error details (if any)

  constructor() {
    super();
  }

  build(
    charactersUsed: number,
    resultedInError: boolean,
    errorMessage?: string
  ): MSTranslatorUsage {
    this.charactersUsed = charactersUsed;
    this.resultedInError = resultedInError;
    this.errorMessage = errorMessage ?? null;

    return this;
  }
}
