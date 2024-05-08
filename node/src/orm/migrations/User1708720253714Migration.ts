import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class User1708720253714 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "username", type: "varchar" },
          { name: "domain", type: "varchar" },
          { name: "permissionId", type: "int" },
          { name: "settingsId", type: "int" },
          { name: "infoId", type: "int" },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "user_permission",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "read", type: "boolean" },
          { name: "write", type: "boolean" },
          { name: "control", type: "boolean" },
        ],
      })
    );
    await queryRunner.createTable(
      new Table({
        name: "user_settings",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "theme", type: "varchar" },
          { name: "language", type: "varchar" },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["permissionId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_permission",
        onDelete: "CASCADE",
      })
    );
    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["settingsId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_settings",
        onDelete: "CASCADE",
      })
    );

    await queryRunner.createTable(
      new Table({
        name: "user_info",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          { name: "position", type: "varchar", isNullable: true },
          { name: "departmentId", type: "int", isNullable: true },
          { name: "decisionMaker", type: "boolean", isNullable: true },
        ],
      })
    );
    await queryRunner.createForeignKey(
      "user_info",
      new TableForeignKey({
        columnNames: ["departmentId"],
        referencedColumnNames: ["id"],
        referencedTableName: "department",
      })
    );
    await queryRunner.createForeignKey(
      "user",
      new TableForeignKey({
        columnNames: ["infoId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user_info",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable("user");
    await queryRunner.dropTable("user_permission");
    await queryRunner.dropTable("user_settings");
    // await queryRunner.dropTable("user_info");
  }
}
