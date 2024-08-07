import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class ToolStatistics1722941093525 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: "user_tool_statistics",
        columns: [
          {
            name: "id",
            type: "int",
            isPrimary: true,
            isGenerated: true,
            generationStrategy: "increment",
            isNullable: false,
          },
          {
            name: "toolName",
            type: "varchar",
            length: "255",
            isNullable: false,
          },
          {
            name: "enterCount",
            type: "int",
            default: 1,
            isNullable: false,
          },
          {
            name: "userId",
            type: "int",
            isNullable: false,
          },
          {
            name: "ormCreateDate",
            type: "timestamp",
            isNullable: false,
            default: "now()",
          },
          {
            name: "ormUpdateDate",
            type: "timestamp",
            isNullable: true,
          },
          {
            name: "ormVersion",
            type: "int",
            isNullable: false,
            default: 1,
          },
        ],
      })
    );

    await queryRunner.createForeignKey(
      "user_tool_statistics",
      new TableForeignKey({
        columnNames: ["userId"],
        referencedColumnNames: ["id"],
        referencedTableName: "user",
        onDelete: "CASCADE",
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    const table = await queryRunner.getTable("user_tool_statistics");
    const foreignKey = table.foreignKeys.find((fk) => fk.columnNames.indexOf("userId") !== -1);
    await queryRunner.dropForeignKey("user_tool_statistics", foreignKey);
    await queryRunner.dropTable("user_tool_statistics");
  }
}
