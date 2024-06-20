import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DocumentPostPutInfoMigration1718627738984 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "postBy",
        type: "varchar",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "postByDate",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "putBy",
        type: "varchar",
        isNullable: true,
      })
    );
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "putByDate",
        type: "varchar",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("document", "postBy");
    await queryRunner.dropColumn("document", "postByDate");
    await queryRunner.dropColumn("document", "putBy");
    await queryRunner.dropColumn("document", "putByDate");
  }
}
