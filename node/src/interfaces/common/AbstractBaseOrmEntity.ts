import { CreateDateColumn, UpdateDateColumn, VersionColumn } from "typeorm";

interface ICreate {
  /**
   * @CreateDateColumn()
   */
  ormCreateDate: Date;

  getOrmTimeSinceCreation(timeUnit: "ms" | "min" | "hr" | "day"): number;
}

interface IUpdate {
  /**
   * @UpdateDateColumn()
   */
  ormUpdateDate: Date;

  getOrmTimeUntilUpdate(timeUnit: "ms" | "min" | "hr" | "day"): number;
}

interface IVersion {
  /**
   * @VersionColumn()
   */

  ormVersion: number;

  getOrmVersion(): number;
}

interface IElapsed {
  /**
   * calculated time from the last non-null create or update date if was updated
   */
  getOrmTimeElapsed(timeUnit: "ms" | "min" | "hr" | "day"): number;
}

abstract class AbstractBaseOrmEntity implements ICreate, IUpdate, IVersion, IElapsed {
  @CreateDateColumn({
    type: "timestamp",
    nullable: false,
    comment: "The date when the entity was created",
  })
  ormCreateDate: Date;

  @UpdateDateColumn({
    type: "timestamp",
    nullable: true,
    comment: "The date when the entity was last updated",
  })
  ormUpdateDate: Date | null;

  @VersionColumn({
    type: "int",
    nullable: false,
    comment: "Version number for optimistic locking",
  })
  /**
   *   Optimistic locking
   *
   * Read Phase: The transaction reads the record and its version number.
   * Validation Phase: Before updating, the transaction checks if the version number in the database matches the version number read initially.
   * Write Phase: If the version numbers match, the transaction proceeds with the update and increments the version number. If they don't match, the transaction is aborted and typically retried.
   */
  ormVersion: number;

  protected convertTime(start: Date, end: Date, timeUnit: "ms" | "min" | "hr" | "day"): number {
    const elapsedTimeMs = end.getTime() - start.getTime();

    switch (timeUnit) {
      case "ms":
        return elapsedTimeMs;
      case "min":
        return elapsedTimeMs / 1000 / 60;
      case "hr":
        return elapsedTimeMs / 1000 / 60 / 60;
      case "day":
        return elapsedTimeMs / 1000 / 60 / 60 / 24;
      default:
        throw new Error(`Invalid time unit: ${timeUnit}`);
    }
  }

  getOrmTimeSinceCreation(timeUnit: "ms" | "min" | "hr" | "day"): number {
    return this.convertTime(this.ormCreateDate, new Date(), timeUnit);
  }

  getOrmTimeUntilUpdate(timeUnit: "ms" | "min" | "hr" | "day"): number {
    if (!this.ormUpdateDate) {
      throw new Error("Update date is not set.");
    }
    return this.convertTime(new Date(), this.ormUpdateDate, timeUnit);
  }

  getOrmVersion(): number {
    return this.ormVersion;
  }

  getOrmTimeElapsed(timeUnit: "ms" | "min" | "hr" | "day"): number {
    const lastDate = this.ormUpdateDate || this.ormCreateDate;
    return this.convertTime(this.ormCreateDate, lastDate, timeUnit);
  }
}

export { AbstractBaseOrmEntity };
