import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddRegistererCommentColumn1721901936470 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "document_change",
      new TableColumn({
        name: "registererComment",
        type: "varchar",
        isNullable: true,
      })
    );

    await queryRunner.changeColumn(
      "document_change",
      "registered",
      new TableColumn({
        name: "registered",
        type: "boolean",
        isNullable: true,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.changeColumn(
      "document_change",
      "registered",
      new TableColumn({
        name: "registered",
        type: "boolean",
        isNullable: false,
      })
    );

    await queryRunner.dropColumn("document_change", "registererComment");
  }
}
