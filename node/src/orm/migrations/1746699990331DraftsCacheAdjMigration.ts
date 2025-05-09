import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DraftsCacheAdj1746699990331 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Add the new UUID column (nullable for now)
    await queryRunner.addColumn(
      "document_creator_draft_cache",
      new TableColumn({
        name: "uuid",
        type: "varchar",
        isNullable: true,
      })
    );

    // Step 2: Fill 'uuid' from stepper.uuid in each record
    await queryRunner.query(`
      UPDATE document_creator_draft_cache
      SET uuid = (stepper->>'uuid')::varchar
      WHERE stepper ? 'uuid'
    `);

    // Step 3: Make 'uuid' column NOT NULL
    await queryRunner.changeColumn(
      "document_creator_draft_cache",
      "uuid",
      new TableColumn({
        name: "uuid",
        type: "varchar",
        isNullable: false,
      })
    );

    // Step 4: Drop uniqueness and then the 'userId' column
    // If there's a unique constraint, drop it first
    const table = await queryRunner.getTable("document_creator_draft_cache");
    const userIdUnique = table?.uniques.find((u) => u.columnNames.includes("userId"));
    if (userIdUnique) {
      await queryRunner.dropUniqueConstraint("document_creator_draft_cache", userIdUnique);
    }

    // Then drop the column itself
    await queryRunner.dropColumn("document_creator_draft_cache", "userId");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Step 1: Re-add userId column (as NOT NULL and unique)
    await queryRunner.addColumn(
      "document_creator_draft_cache",
      new TableColumn({
        name: "userId",
        type: "int",
        isNullable: false,
        isUnique: true,
      })
    );

    // Step 2: Drop the uuid column
    await queryRunner.dropColumn("document_creator_draft_cache", "uuid");
  }
}
