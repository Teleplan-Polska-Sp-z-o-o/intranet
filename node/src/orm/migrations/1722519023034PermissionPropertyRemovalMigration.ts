import { MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class PermissionPropertyRemoval1722519023034 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn("user_permission", "read");
    await queryRunner.dropColumn("user_permission", "write");
    await queryRunner.dropColumn("user_permission", "control");
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn(
      "user_permission",
      new TableColumn({
        name: "read",
        type: "boolean",
      })
    );

    await queryRunner.addColumn(
      "user_permission",
      new TableColumn({
        name: "write",
        type: "boolean",
      })
    );

    await queryRunner.addColumn(
      "user_permission",
      new TableColumn({
        name: "control",
        type: "boolean",
      })
    );
  }
}
