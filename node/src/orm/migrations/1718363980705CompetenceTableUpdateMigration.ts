import { MigrationInterface, QueryRunner, TableColumn, TableIndex } from "typeorm";

export class CompetenceTableUpdate1718363980705 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createIndex(
      "competence",
      new TableIndex({
        name: "IDX_COMPETENCE_NAME_UNIQUE",
        columnNames: ["name"],
        isUnique: true,
      })
    );

    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "postBy",
        type: "varchar",
      })
    );
    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "postByDate",
        type: "varchar",
      })
    );

    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "putBy",
        type: "varchar",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "competence",
      new TableColumn({
        name: "putByDate",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropIndex("competence", "IDX_COMPETENCE_NAME_UNIQUE");
    await queryRunner.dropColumn("competence", "postBy");
    await queryRunner.dropColumn("competence", "postByDate");
    await queryRunner.dropColumn("competence", "putBy");
    await queryRunner.dropColumn("competence", "putByDate");
  }
}
