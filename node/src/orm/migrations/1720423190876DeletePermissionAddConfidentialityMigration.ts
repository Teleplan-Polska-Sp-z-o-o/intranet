import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class DeletePermissionAddConfidentiality1720423190876 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Check if the "permission" column exists
    const hasPermissionColumn = await queryRunner.hasColumn("news", "permission");
    // If "permission" column exists, drop it
    if (hasPermissionColumn) {
      await queryRunner.dropColumn("news", "permission");
    }

    // Check if the "confidentiality" column exists before adding it
    const hasConfidentialityColumn = await queryRunner.hasColumn("news", "confidentiality");
    if (!hasConfidentialityColumn) {
      await queryRunner.addColumn(
        "news",
        new TableColumn({
          name: "confidentiality",
          type: "varchar",
          default: "'public'",
        })
      );
    }
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
