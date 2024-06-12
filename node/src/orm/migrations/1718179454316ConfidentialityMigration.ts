import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class Confidentiality1718179454316 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_permission",
      new TableColumn({
        name: "confidentiality",
        type: "varchar",
        default: "'public'",
      })
    );
    await queryRunner.addColumn(
      "document",
      new TableColumn({
        name: "confidentiality",
        type: "varchar",
        default: "'public'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_permission", "confidentiality");
    await queryRunner.dropColumn("document", "confidentiality");
  }
}
