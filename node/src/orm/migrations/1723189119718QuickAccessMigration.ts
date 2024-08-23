import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class QuickAccess1723189119718 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create the document_user join table
    await queryRunner.createTable(
      new Table({
        name: "document_user",
        columns: [
          {
            name: "documentId",
            type: "int",
            isPrimary: true,
          },
          {
            name: "userId",
            type: "int",
            isPrimary: true,
          },
        ],
      }),
      true
    );

    // Create foreign key for documentId
    await queryRunner.createForeignKey(
      "document_user",
      new TableForeignKey({
        columnNames: ["documentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "document",
        onDelete: "CASCADE",
      })
    );

    // Create foreign key for userId
    await queryRunner.createForeignKey(
      "document_user",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );

    // Insert 'all' and 'quick' subgroups and remove 'instructions', 'visuals', 'msd' subgroups
    const documentGroups = await queryRunner.query(
      `SELECT id FROM "user_group" WHERE name = 'documents'`
    );

    // Insert 'all' and 'quick' subgroups for each 'documents' group
    for (const group of documentGroups) {
      const documentGroupId = group.id;

      // Insert 'all' and 'quick'
      await queryRunner.query(
        `INSERT INTO "user_subgroup" (name, "groupId") VALUES ('all', $1), ('quick', $1)`,
        [documentGroupId]
      );

      // Remove 'instructions', 'visuals', and 'msd'
      await queryRunner.query(
        `DELETE FROM "user_subgroup" WHERE name IN ('instructions', 'visuals', 'msd') AND "groupId" = $1`,
        [documentGroupId]
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign keys first
    const table = await queryRunner.getTable("document_user");
    const documentForeignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("documentId") !== -1
    );
    const userForeignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("userId") !== -1);

    await queryRunner.dropForeignKey("document_user", documentForeignKey);
    await queryRunner.dropForeignKey("document_user", userForeignKey);

    // Then drop the table
    await queryRunner.dropTable("document_user");

    // Find all groups with the name 'documents'
    const documentGroups = await queryRunner.query(
      `SELECT id FROM "user_group" WHERE name = 'documents'`
    );

    // Delete the 'all' and 'quick' subgroups and reinsert 'instructions', 'visuals', 'msd' subgroups
    for (const group of documentGroups) {
      const documentGroupId = group.id;

      // Delete 'all' and 'quick'
      await queryRunner.query(
        `DELETE FROM "user_subgroup" WHERE name IN ('all', 'quick') AND "groupId" = $1`,
        [documentGroupId]
      );

      // Reinsert 'instructions', 'visuals', and 'msd'
      await queryRunner.query(
        `INSERT INTO "user_subgroup" (name, "groupId") VALUES ('instructions', $1), ('visuals', $1), ('msd', $1)`,
        [documentGroupId]
      );
    }
  }
}
