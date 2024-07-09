import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class AddUserLoginDetails1720511458048 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_login_details",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
          },
          {
            name: "loginTime",
            type: "timestamp",
            default: "now()",
          },
          {
            name: "logoutTime",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "duration",
            type: "int",
            default: 0,
          },
          {
            name: "userId",
            type: "int",
          },
        ],
      }),
      true
    );

    await queryRunner.createForeignKey(
      "user_login_details",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop the foreign key first
    const table = await queryRunner.getTable("user_login_details");
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("userId") !== -1);
    await queryRunner.dropForeignKey("user_login_details", foreignKey);

    // Drop the user_login_details table
    await queryRunner.dropTable("user_login_details");
  }
}
