import { MigrationInterface, QueryRunner, Table, TableColumn, TableForeignKey } from "typeorm";

export class DocumentCompetence1718611171624 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    let table = await queryRunner.getTable("document");
    const foreignKey = table.foreignKeys.find(
      (fk) => fk.columnNames.indexOf("competenceId") !== -1
    );
    await queryRunner.dropForeignKey("document", foreignKey);
    await queryRunner.dropColumn("document", "competenceId");

    await queryRunner.createTable(
      new Table({
        name: "document_competence",
        columns: [
          {
            name: "documentId",
            type: "int",
            isPrimary: true,
          },
          {
            name: "competenceId",
            type: "int",
            isPrimary: true,
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "document_competence",
      new TableForeignKey({
        columnNames: ["documentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "document",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );

    await queryRunner.createForeignKey(
      "document_competence",
      new TableForeignKey({
        columnNames: ["competenceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "competence",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("document_competence");
    const foreignKeys = table.foreignKeys.filter((fk) =>
      ["documentId", "competenceId"].includes(fk.columnNames[0])
    );
    await queryRunner.dropForeignKeys("document_competence", foreignKeys);
    await queryRunner.dropTable("document_competence");

    // Add the old column and foreign key back
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "competenceId",
        type: "int",
        isNullable: true,
      })
    );

    await queryRunner.createForeignKey(
      "document",
      new TableForeignKey({
        columnNames: ["competenceId"],
        referencedColumnNames: ["id"],
        referencedTableName: "competence",
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      })
    );
  }
}
