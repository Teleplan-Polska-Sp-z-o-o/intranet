import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DeletePermissionAddConfidentiality1720423190876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("news", "permission");

    await queryRunner.addColumn(
      "news",
      new TableColumn({
        name: "confidentiality",
        type: "varchar",
        default: "'public'",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Revert by removing the confidentiality column
    await queryRunner.dropColumn("news", "confidentiality");

    // Revert by adding the permission column
    await queryRunner.addColumn(
      "news",
      new TableColumn({
        name: "permission",
        type: "jsonb",
      })
    );
  }
}
